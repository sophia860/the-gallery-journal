import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { 
  requireAuth, 
  requireEditor, 
  requireManagingEditor, 
  rateLimit, 
  requestTimeout,
  errorHandler,
  requireOwnership,
  AuthContext 
} from "./middleware.tsx";
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse,
  paginate,
  logError,
  logInfo 
} from "./utils.tsx";
import {
  validateSignup,
  validateDraft,
  validateExhibit,
  validateRequired,
  validateUUID,
  validatePagination,
  sanitizeString,
  ValidationError
} from "./validation.tsx";
import { registerAdditionalRoutes } from "./routes.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Global middleware
app.use('*', errorHandler);
app.use('*', logger(console.log));
app.use('*', requestTimeout(30000)); // 30 second timeout

// Enable CORS for all routes
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
  }),
);

// ============ HEALTH CHECK ============

app.get("/make-server-07dc516a/health", async (c) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      supabase: "unknown",
      kvStore: "unknown",
    }
  };

  // Check Supabase connection
  try {
    const { error } = await supabase.auth.getSession();
    health.services.supabase = error ? "error" : "ok";
  } catch (err) {
    health.services.supabase = "error";
    logError('health:supabase', err);
  }

  // Check KV store
  try {
    await kv.get('health_check');
    health.services.kvStore = "ok";
  } catch (err) {
    health.services.kvStore = "error";
    logError('health:kvStore', err);
  }

  const overallStatus = Object.values(health.services).every(s => s === 'ok') ? 'ok' : 'degraded';
  health.status = overallStatus;

  return successResponse(c, health, undefined, overallStatus === 'ok' ? 200 : 503);
});

// ============ AUTH ROUTES ============

// Sign up a new writer
app.post(
  "/make-server-07dc516a/auth/signup",
  rateLimit({ requests: 5, windowMs: 60000, keyPrefix: 'signup' }),
  async (c) => {
    try {
      const body = await c.req.json();
      
      // Validate input
      const validationErrors = validateSignup(body);
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }
      
      const { email, password, name, writerName } = body;
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeString(email).toLowerCase();
      const sanitizedName = sanitizeString(name);
      const sanitizedWriterName = sanitizeString(writerName || name);
      
      // Create auth user with auto-confirm since email server not configured
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: sanitizedEmail,
        password,
        user_metadata: { 
          name: sanitizedName,
          role: 'writer',
        },
        email_confirm: true,
      });

      if (authError) {
        logError('signup:createUser', authError);
        // Provide user-friendly error messages
        if (authError.message.includes('already been registered')) {
          return errorResponse(c, 'An account with this email already exists. Please sign in instead.', 'DUPLICATE_EMAIL', 409);
        }
        return errorResponse(c, authError.message, 'AUTH_ERROR', 400);
      }

      if (!authData.user) {
        return errorResponse(c, 'Failed to create user', 'AUTH_ERROR', 500);
      }

      // Create writer room profile
      const room = {
        id: authData.user.id,
        writerName: sanitizedWriterName,
        name: sanitizedName,
        email: sanitizedEmail,
        bio: '',
        role: 'writer',
        atmosphere: 'warm',
        customFont: 'default',
        pinnedPieceId: null,
        bookshelf: [],
        ambientSound: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await kv.set(`room:${authData.user.id}`, room);
      } catch (err) {
        // If room creation fails, clean up the created user
        logError('signup:createRoom', err);
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupErr) {
          logError('signup:cleanupUser', cleanupErr);
        }
        return errorResponse(c, 'Failed to create user profile', 'INTERNAL_ERROR', 500);
      }

      logInfo('signup:success', `New user created: ${authData.user.id}`);

      return successResponse(c, {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: sanitizedName,
          role: 'writer',
        },
        room,
      }, undefined, 201);
    } catch (err: any) {
      logError('signup', err);
      return errorResponse(c, 'Failed to create account', 'INTERNAL_ERROR', 500);
    }
  }
);

// Get current user session
app.get(
  "/make-server-07dc516a/auth/session",
  async (c: AuthContext) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(c, 'No session found', 'UNAUTHORIZED', 401);
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return errorResponse(c, 'Invalid session', 'UNAUTHORIZED', 401);
      }

      // Get user's room
      const room = await kv.get(`room:${user.id}`);

      return successResponse(c, {
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          role: user.user_metadata?.role || 'writer',
        },
        room,
      });
    } catch (err: any) {
      logError('session', err);
      return errorResponse(c, 'Failed to get session', 'INTERNAL_ERROR', 500);
    }
  }
);

// ============ ROOM ROUTES ============

// List all rooms (paginated, public)
app.get("/make-server-07dc516a/rooms", async (c) => {
  try {
    const limit = c.req.query('limit');
    const offset = c.req.query('offset');
    
    const { limit: parsedLimit, offset: parsedOffset, errors } = validatePagination(limit, offset);
    
    if (errors.length > 0) {
      return validationErrorResponse(c, errors);
    }

    const allRooms = await kv.getByPrefix('room:');
    
    // Filter to only include public info
    const rooms = allRooms.map(room => ({
      id: room.id,
      writerName: room.writerName,
      bio: room.bio,
      atmosphere: room.atmosphere,
    }));

    const { items, total } = paginate(rooms, parsedOffset, parsedLimit);

    return successResponse(c, items, {
      offset: parsedOffset,
      limit: parsedLimit,
      total,
    });
  } catch (err: any) {
    logError('rooms:list', err);
    return errorResponse(c, 'Failed to fetch rooms', 'INTERNAL_ERROR', 500);
  }
});

// Get a specific room
app.get("/make-server-07dc516a/rooms/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const uuidErrors = validateUUID(userId, 'userId');
    if (uuidErrors.length > 0) {
      return validationErrorResponse(c, uuidErrors);
    }

    const room = await kv.get(`room:${userId}`);
    
    if (!room) {
      return errorResponse(c, 'Room not found', 'NOT_FOUND', 404);
    }

    return successResponse(c, room);
  } catch (err: any) {
    logError('rooms:get', err);
    return errorResponse(c, 'Failed to fetch room', 'INTERNAL_ERROR', 500);
  }
});

// Update a room (auth required, owner only)
app.put(
  "/make-server-07dc516a/rooms/:userId",
  rateLimit({ requests: 30, windowMs: 60000, keyPrefix: 'update_room' }),
  requireAuth,
  requireOwnership('room'),
  async (c: AuthContext) => {
    try {
      const userId = c.req.param('userId');
      const updates = await c.req.json();
      
      // Sanitize string inputs
      if (updates.writerName) updates.writerName = sanitizeString(updates.writerName);
      if (updates.bio) updates.bio = sanitizeString(updates.bio);
      
      const currentRoom = await kv.get(`room:${userId}`);
      
      if (!currentRoom) {
        return errorResponse(c, 'Room not found', 'NOT_FOUND', 404);
      }

      const updatedRoom = { 
        ...currentRoom, 
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await kv.set(`room:${userId}`, updatedRoom);

      logInfo('rooms:update', `Room updated: ${userId}`);

      return successResponse(c, updatedRoom);
    } catch (err: any) {
      logError('rooms:update', err);
      return errorResponse(c, 'Failed to update room', 'INTERNAL_ERROR', 500);
    }
  }
);

// ============ DRAFTS ROUTES ============

// Create a new draft (auth required)
app.post(
  "/make-server-07dc516a/drafts",
  rateLimit({ requests: 30, windowMs: 60000, keyPrefix: 'create_draft' }),
  requireAuth,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateDraft(body);
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { title, content, type, toolType, metadata } = body;
      
      const draftId = crypto.randomUUID();
      const draft = {
        id: draftId,
        userId: c.user!.id,
        title: sanitizeString(title || 'Untitled'),
        content: sanitizeString(content),
        type: type || 'prose',
        toolType: toolType || 'freewrite',
        metadata: metadata || {},
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`draft:${draftId}`, draft);
      
      const userDrafts = await kv.get(`user_drafts:${c.user!.id}`) || [];
      userDrafts.unshift(draftId);
      await kv.set(`user_drafts:${c.user!.id}`, userDrafts);

      logInfo('drafts:create', `Draft created: ${draftId}`);

      return successResponse(c, draft, undefined, 201);
    } catch (err: any) {
      logError('drafts:create', err);
      return errorResponse(c, 'Failed to create draft', 'INTERNAL_ERROR', 500);
    }
  }
);

// Get user's drafts (auth required)
app.get(
  "/make-server-07dc516a/drafts/user/:userId",
  requireAuth,
  async (c: AuthContext) => {
    try {
      const userId = c.req.param('userId');
      
      if (c.user!.id !== userId) {
        return errorResponse(c, 'You can only view your own drafts', 'FORBIDDEN', 403);
      }

      const draftIds = await kv.get(`user_drafts:${userId}`) || [];
      
      const drafts = [];
      for (const id of draftIds) {
        const draft = await kv.get(`draft:${id}`);
        if (draft) drafts.push(draft);
      }

      return successResponse(c, drafts);
    } catch (err: any) {
      logError('drafts:getUserDrafts', err);
      return errorResponse(c, 'Failed to fetch drafts', 'INTERNAL_ERROR', 500);
    }
  }
);

// Get a single draft (auth required, owner only)
app.get(
  "/make-server-07dc516a/drafts/:draftId",
  requireAuth,
  async (c: AuthContext) => {
    try {
      const draftId = c.req.param('draftId');
      
      const uuidErrors = validateUUID(draftId, 'draftId');
      if (uuidErrors.length > 0) {
        return validationErrorResponse(c, uuidErrors);
      }

      const draft = await kv.get(`draft:${draftId}`);
      
      if (!draft) {
        return errorResponse(c, 'Draft not found', 'NOT_FOUND', 404);
      }

      if (draft.userId !== c.user!.id) {
        return errorResponse(c, 'You can only view your own drafts', 'FORBIDDEN', 403);
      }

      return successResponse(c, draft);
    } catch (err: any) {
      logError('drafts:get', err);
      return errorResponse(c, 'Failed to fetch draft', 'INTERNAL_ERROR', 500);
    }
  }
);

// Update a draft (auth required, owner only)
app.put(
  "/make-server-07dc516a/drafts/:draftId",
  rateLimit({ requests: 30, windowMs: 60000, keyPrefix: 'update_draft' }),
  requireAuth,
  requireOwnership('draft'),
  async (c: AuthContext) => {
    try {
      const draftId = c.req.param('draftId');
      const updates = await c.req.json();
      
      if (updates.title) updates.title = sanitizeString(updates.title);
      if (updates.content) updates.content = sanitizeString(updates.content);
      
      const currentDraft = await kv.get(`draft:${draftId}`);
      
      if (!currentDraft) {
        return errorResponse(c, 'Draft not found', 'NOT_FOUND', 404);
      }

      const updatedDraft = { 
        ...currentDraft, 
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await kv.set(`draft:${draftId}`, updatedDraft);

      logInfo('drafts:update', `Draft updated: ${draftId}`);

      return successResponse(c, updatedDraft);
    } catch (err: any) {
      logError('drafts:update', err);
      return errorResponse(c, 'Failed to update draft', 'INTERNAL_ERROR', 500);
    }
  }
);

// Delete a draft (auth required, owner only)
app.delete(
  "/make-server-07dc516a/drafts/:draftId",
  requireAuth,
  requireOwnership('draft'),
  async (c: AuthContext) => {
    try {
      const draftId = c.req.param('draftId');
      
      const draft = await kv.get(`draft:${draftId}`);
      if (!draft) {
        return errorResponse(c, 'Draft not found', 'NOT_FOUND', 404);
      }

      await kv.del(`draft:${draftId}`);
      
      // Remove from user's drafts list
      const userDrafts = await kv.get(`user_drafts:${c.user!.id}`) || [];
      const updatedDrafts = userDrafts.filter((id: string) => id !== draftId);
      await kv.set(`user_drafts:${c.user!.id}`, updatedDrafts);

      logInfo('drafts:delete', `Draft deleted: ${draftId}`);

      return successResponse(c, { deleted: true });
    } catch (err: any) {
      logError('drafts:delete', err);
      return errorResponse(c, 'Failed to delete draft', 'INTERNAL_ERROR', 500);
    }
  }
);

// Continue with more routes...
// (Due to length limits, I'll create a continuation file)

registerAdditionalRoutes(app);

Deno.serve(app.fetch);