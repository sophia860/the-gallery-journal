// Additional routes for the server - exhibits, pieces, letters, submissions, etc.
import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { 
  requireAuth, 
  requireEditor, 
  requireManagingEditor,
  rateLimit,
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
  validateExhibit,
  validateDraft,
  validateRequired,
  validateUUID,
  validatePagination,
  sanitizeString,
} from "./validation.tsx";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

export function registerAdditionalRoutes(app: Hono) {

// ============ ADMIN ROUTES ============

// Clear all exhibits from the gallery (admin only)
app.delete(
  "/make-server-07dc516a/admin/clear-exhibits",
  requireAuth,
  async (c: AuthContext) => {
    try {
      // Get all exhibit keys
      const allExhibits = await kv.getByPrefix('exhibit:');
      
      // Delete each exhibit
      const exhibitKeys = allExhibits.map(ex => `exhibit:${ex.id}`);
      if (exhibitKeys.length > 0) {
        await kv.mdel(exhibitKeys);
      }
      
      // Clear all user_exhibits lists
      const userExhibitKeys = await kv.getByPrefix('user_exhibits:');
      const userKeys = userExhibitKeys.map(() => userExhibitKeys).flat();
      if (userKeys.length > 0) {
        await kv.mdel(userKeys.map(k => `user_exhibits:${k}`));
      }
      
      logInfo('admin:clear-exhibits', `Cleared ${exhibitKeys.length} exhibits from gallery`);
      
      return successResponse(c, {
        message: 'All exhibits cleared from gallery',
        count: exhibitKeys.length
      });
    } catch (err: any) {
      logError('admin:clear-exhibits', err);
      return errorResponse(c, 'Failed to clear exhibits', 'INTERNAL_ERROR', 500);
    }
  }
);

// ============ EXHIBIT ROUTES ============

app.post(
  "/make-server-07dc516a/exhibits",
  rateLimit({ requests: 30, windowMs: 60000, keyPrefix: 'create_exhibit' }),
  requireAuth,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateExhibit(body);
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { title, openingNote, pieces, coverImage } = body;
      
      const exhibitId = crypto.randomUUID();
      const exhibit = {
        id: exhibitId,
        userId: c.user!.id,
        title: sanitizeString(title),
        openingNote: sanitizeString(openingNote || ''),
        pieces: pieces || [],
        coverImage: coverImage || null,
        opened: false,
        scheduledDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`exhibit:${exhibitId}`, exhibit);
      
      const userExhibits = await kv.get(`user_exhibits:${c.user!.id}`) || [];
      userExhibits.unshift(exhibitId);
      await kv.set(`user_exhibits:${c.user!.id}`, userExhibits);

      logInfo('exhibits:create', `Exhibit created: ${exhibitId}`);

      return successResponse(c, exhibit, undefined, 201);
    } catch (err: any) {
      logError('exhibits:create', err);
      return errorResponse(c, 'Failed to create exhibit', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get("/make-server-07dc516a/exhibits", async (c) => {
  try {
    const limit = c.req.query('limit');
    const offset = c.req.query('offset');
    
    const { limit: parsedLimit, offset: parsedOffset, errors } = validatePagination(limit, offset);
    if (errors.length > 0) {
      return validationErrorResponse(c, errors);
    }

    const allExhibits = await kv.getByPrefix('exhibit:');
    const { items, total } = paginate(allExhibits, parsedOffset, parsedLimit);

    return successResponse(c, items, {
      offset: parsedOffset,
      limit: parsedLimit,
      total,
    });
  } catch (err: any) {
    logError('exhibits:list', err);
    return errorResponse(c, 'Failed to fetch exhibits', 'INTERNAL_ERROR', 500);
  }
});

app.get("/make-server-07dc516a/exhibits/:exhibitId", async (c) => {
  try {
    const exhibitId = c.req.param('exhibitId');
    
    const uuidErrors = validateUUID(exhibitId, 'exhibitId');
    if (uuidErrors.length > 0) {
      return validationErrorResponse(c, uuidErrors);
    }

    const exhibit = await kv.get(`exhibit:${exhibitId}`);
    
    if (!exhibit) {
      return errorResponse(c, 'Exhibit not found', 'NOT_FOUND', 404);
    }

    return successResponse(c, exhibit);
  } catch (err: any) {
    logError('exhibits:get', err);
    return errorResponse(c, 'Failed to fetch exhibit', 'INTERNAL_ERROR', 500);
  }
});

app.get("/make-server-07dc516a/exhibits/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const exhibitIds = await kv.get(`user_exhibits:${userId}`) || [];
    
    const exhibits = [];
    for (const id of exhibitIds) {
      const exhibit = await kv.get(`exhibit:${id}`);
      if (exhibit) exhibits.push(exhibit);
    }

    return successResponse(c, exhibits);
  } catch (err: any) {
    logError('exhibits:getUserExhibits', err);
    return errorResponse(c, 'Failed to fetch exhibits', 'INTERNAL_ERROR', 500);
  }
});

// ============ PIECES ROUTES ============

app.post(
  "/make-server-07dc516a/pieces",
  rateLimit({ requests: 30, windowMs: 60000, keyPrefix: 'create_piece' }),
  requireAuth,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateRequired({
        title: body.title,
        content: body.content,
      });
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { title, content, type, metadata } = body;
      
      const pieceId = crypto.randomUUID();
      const piece = {
        id: pieceId,
        userId: c.user!.id,
        title: sanitizeString(title),
        content: sanitizeString(content),
        type: type || 'prose',
        metadata: metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`piece:${pieceId}`, piece);

      logInfo('pieces:create', `Piece created: ${pieceId}`);

      return successResponse(c, piece, undefined, 201);
    } catch (err: any) {
      logError('pieces:create', err);
      return errorResponse(c, 'Failed to create piece', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get("/make-server-07dc516a/pieces/:pieceId", async (c) => {
  try {
    const pieceId = c.req.param('pieceId');
    
    const uuidErrors = validateUUID(pieceId, 'pieceId');
    if (uuidErrors.length > 0) {
      return validationErrorResponse(c, uuidErrors);
    }

    const piece = await kv.get(`piece:${pieceId}`);
    
    if (!piece) {
      return errorResponse(c, 'Piece not found', 'NOT_FOUND', 404);
    }

    return successResponse(c, piece);
  } catch (err: any) {
    logError('pieces:get', err);
    return errorResponse(c, 'Failed to fetch piece', 'INTERNAL_ERROR', 500);
  }
});

// ============ COMMONPLACE ROUTES ============

app.post(
  "/make-server-07dc516a/commonplace",
  rateLimit({ requests: 30, windowMs: 60000, keyPrefix: 'create_commonplace' }),
  requireAuth,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateRequired({
        pieceId: body.pieceId,
        text: body.text,
      });
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { pieceId, text, context } = body;
      
      const entryId = crypto.randomUUID();
      const entry = {
        id: entryId,
        userId: c.user!.id,
        pieceId,
        text: sanitizeString(text),
        context: sanitizeString(context || ''),
        savedAt: new Date().toISOString(),
      };

      await kv.set(`commonplace:${c.user!.id}:${entryId}`, entry);

      logInfo('commonplace:create', `Entry created: ${entryId}`);

      return successResponse(c, entry, undefined, 201);
    } catch (err: any) {
      logError('commonplace:create', err);
      return errorResponse(c, 'Failed to save to commonplace book', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get(
  "/make-server-07dc516a/commonplace/:userId",
  requireAuth,
  async (c: AuthContext) => {
    try {
      const userId = c.req.param('userId');
      
      if (c.user!.id !== userId) {
        return errorResponse(c, 'Commonplace books are private', 'FORBIDDEN', 403);
      }

      const entries = await kv.getByPrefix(`commonplace:${userId}:`);

      return successResponse(c, entries || []);
    } catch (err: any) {
      logError('commonplace:get', err);
      return errorResponse(c, 'Failed to fetch commonplace book', 'INTERNAL_ERROR', 500);
    }
  }
);

app.delete(
  "/make-server-07dc516a/commonplace/:entryId",
  requireAuth,
  async (c: AuthContext) => {
    try {
      const entryId = c.req.param('entryId');
      const entry = await kv.get(`commonplace:${c.user!.id}:${entryId}`);
      
      if (!entry) {
        return errorResponse(c, 'Entry not found', 'NOT_FOUND', 404);
      }

      await kv.del(`commonplace:${c.user!.id}:${entryId}`);

      logInfo('commonplace:delete', `Entry deleted: ${entryId}`);

      return successResponse(c, { deleted: true });
    } catch (err: any) {
      logError('commonplace:delete', err);
      return errorResponse(c, 'Failed to delete entry', 'INTERNAL_ERROR', 500);
    }
  }
);

// ============ LETTERS ROUTES ============

app.post(
  "/make-server-07dc516a/letters",
  rateLimit({ requests: 10, windowMs: 60000, keyPrefix: 'send_letter' }),
  requireAuth,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateRequired({
        recipientId: body.recipientId,
        body: body.body,
      });
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { recipientId, subject, body: letterBody } = body;
      
      const letterId = crypto.randomUUID();
      const letter = {
        id: letterId,
        senderId: c.user!.id,
        recipientId,
        subject: sanitizeString(subject || '(No subject)'),
        body: sanitizeString(letterBody),
        sentAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        read: false,
        createdAt: new Date().toISOString(),
      };

      await kv.set(`letter:${letterId}`, letter);
      
      const recipientLetters = await kv.get(`letters_inbox:${recipientId}`) || [];
      recipientLetters.unshift(letterId);
      await kv.set(`letters_inbox:${recipientId}`, recipientLetters);
      
      const senderLetters = await kv.get(`letters_sent:${c.user!.id}`) || [];
      senderLetters.unshift(letterId);
      await kv.set(`letters_sent:${c.user!.id}`, senderLetters);

      logInfo('letters:send', `Letter sent: ${letterId}`);

      return successResponse(c, letter, undefined, 201);
    } catch (err: any) {
      logError('letters:send', err);
      return errorResponse(c, 'Failed to send letter', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get(
  "/make-server-07dc516a/letters/:userId",
  requireAuth,
  async (c: AuthContext) => {
    try {
      const userId = c.req.param('userId');
      
      if (c.user!.id !== userId) {
        return errorResponse(c, 'You can only view your own letters', 'FORBIDDEN', 403);
      }

      const inboxIds = await kv.get(`letters_inbox:${userId}`) || [];
      const sentIds = await kv.get(`letters_sent:${userId}`) || [];
      
      const inbox = [];
      const sent = [];
      
      for (const id of inboxIds) {
        const letter = await kv.get(`letter:${id}`);
        if (letter && new Date(letter.sentAt) <= new Date()) {
          inbox.push(letter);
        }
      }
      
      for (const id of sentIds) {
        const letter = await kv.get(`letter:${id}`);
        if (letter) sent.push(letter);
      }

      return successResponse(c, { inbox, sent });
    } catch (err: any) {
      logError('letters:get', err);
      return errorResponse(c, 'Failed to fetch letters', 'INTERNAL_ERROR', 500);
    }
  }
);

// ============ EDITOR SUBMISSION ROUTES ============

// Get all submissions (with filtering and search)
app.get(
  "/make-server-07dc516a/editor/submissions",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const { status, search, sort } = c.req.query();
      
      // Get all submission IDs
      const submissionIds = await kv.get('submissions:all') || [];
      
      // Fetch all submissions
      const submissions = [];
      for (const id of submissionIds) {
        const submission = await kv.get(`submission:${id}`);
        if (submission) {
          submissions.push(submission);
        }
      }
      
      // Apply filters
      let filtered = submissions;
      
      if (status && status !== 'all') {
        filtered = filtered.filter(s => s.status === status);
      }
      
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(s => 
          s.title?.toLowerCase().includes(query) ||
          s.authorName?.toLowerCase().includes(query) ||
          s.content?.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      if (sort === 'title') {
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else if (sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else {
        // Default: sort by date (newest first)
        filtered.sort((a, b) => 
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
      }
      
      logInfo('editor:list-submissions', `Fetched ${filtered.length} submissions (filtered from ${submissions.length})`);
      
      return successResponse(c, { submissions: filtered });
    } catch (err: any) {
      logError('editor:list-submissions', err);
      return errorResponse(c, 'Failed to fetch submissions', 'INTERNAL_ERROR', 500);
    }
  }
);

// Get single submission
app.get(
  "/make-server-07dc516a/editor/submissions/:id",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const id = c.req.param('id');
      const submission = await kv.get(`submission:${id}`);
      
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }
      
      return successResponse(c, { submission });
    } catch (err: any) {
      logError('editor:get-submission', err);
      return errorResponse(c, 'Failed to fetch submission', 'INTERNAL_ERROR', 500);
    }
  }
);

// Update submission status
app.put(
  "/make-server-07dc516a/editor/submissions/:id/status",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const { status, notes } = body;
      
      // Validate status
      const validStatuses = ['pending', 'queued', 'in_issue', 'published', 'revisions_requested', 'rejected'];
      if (!validStatuses.includes(status)) {
        return validationErrorResponse(c, ['Invalid status value']);
      }
      
      const submission = await kv.get(`submission:${id}`);
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }
      
      // Update submission
      submission.status = status;
      if (notes !== undefined) {
        submission.internalNotes = sanitizeString(notes);
      }
      
      // Add history entry
      submission.history = submission.history || [];
      submission.history.push({
        action: `Status changed to ${status}`,
        timestamp: new Date().toISOString(),
        user: c.user!.email || 'Editor'
      });
      
      await kv.set(`submission:${id}`, submission);
      
      logInfo('editor:update-status', `Updated submission ${id} to ${status}`);
      
      return successResponse(c, { submission });
    } catch (err: any) {
      logError('editor:update-status', err);
      return errorResponse(c, 'Failed to update status', 'INTERNAL_ERROR', 500);
    }
  }
);

// Update internal notes
app.put(
  "/make-server-07dc516a/editor/submissions/:id/notes",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const { notes } = body;
      
      const submission = await kv.get(`submission:${id}`);
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }
      
      submission.internalNotes = sanitizeString(notes || '');
      
      // Add history entry
      submission.history = submission.history || [];
      submission.history.push({
        action: 'Internal notes updated',
        timestamp: new Date().toISOString(),
        user: c.user!.email || 'Editor'
      });
      
      await kv.set(`submission:${id}`, submission);
      
      return successResponse(c, { submission });
    } catch (err: any) {
      logError('editor:update-notes', err);
      return errorResponse(c, 'Failed to update notes', 'INTERNAL_ERROR', 500);
    }
  }
);

// Update rating
app.put(
  "/make-server-07dc516a/editor/submissions/:id/rating",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const { rating } = body;
      
      // Validate rating
      if (typeof rating !== 'number' || rating < 0 || rating > 5) {
        return validationErrorResponse(c, ['Rating must be between 0 and 5']);
      }
      
      const submission = await kv.get(`submission:${id}`);
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }
      
      submission.rating = rating;
      
      // Add history entry
      submission.history = submission.history || [];
      submission.history.push({
        action: `Rated ${rating} stars`,
        timestamp: new Date().toISOString(),
        user: c.user!.email || 'Editor'
      });
      
      await kv.set(`submission:${id}`, submission);
      
      return successResponse(c, { submission });
    } catch (err: any) {
      logError('editor:update-rating', err);
      return errorResponse(c, 'Failed to update rating', 'INTERNAL_ERROR', 500);
    }
  }
);

// Schedule submission
app.put(
  "/make-server-07dc516a/editor/submissions/:id/schedule",
  requireAuth,
  requireManagingEditor,
  async (c: AuthContext) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const { scheduledDate, category } = body;
      
      if (!scheduledDate) {
        return validationErrorResponse(c, ['scheduledDate is required']);
      }
      
      const submission = await kv.get(`submission:${id}`);
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }
      
      submission.scheduledDate = scheduledDate;
      if (category) {
        submission.category = sanitizeString(category);
      }
      
      // Add history entry
      submission.history = submission.history || [];
      submission.history.push({
        action: `Scheduled for ${scheduledDate}`,
        timestamp: new Date().toISOString(),
        user: c.user!.email || 'Managing Editor'
      });
      
      await kv.set(`submission:${id}`, submission);
      
      return successResponse(c, { submission });
    } catch (err: any) {
      logError('editor:schedule', err);
      return errorResponse(c, 'Failed to schedule submission', 'INTERNAL_ERROR', 500);
    }
  }
);

// Request revisions
app.post(
  "/make-server-07dc516a/editor/submissions/:id/revisions",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const { feedback } = body;
      
      if (!feedback) {
        return validationErrorResponse(c, ['feedback is required']);
      }
      
      const submission = await kv.get(`submission:${id}`);
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }
      
      submission.status = 'revisions_requested';
      submission.feedback = feedback;
      
      // Add history entry
      submission.history = submission.history || [];
      submission.history.push({
        action: 'Revisions requested',
        timestamp: new Date().toISOString(),
        user: c.user!.email || 'Editor'
      });
      
      await kv.set(`submission:${id}`, submission);
      
      // TODO: Send notification to author (when notification system is implemented)
      
      logInfo('editor:request-revisions', `Requested revisions for submission ${id}`);
      
      return successResponse(c, { submission });
    } catch (err: any) {
      logError('editor:request-revisions', err);
      return errorResponse(c, 'Failed to request revisions', 'INTERNAL_ERROR', 500);
    }
  }
);

// Get submission history
app.get(
  "/make-server-07dc516a/editor/submissions/:id/history",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const id = c.req.param('id');
      const submission = await kv.get(`submission:${id}`);
      
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }
      
      return successResponse(c, { history: submission.history || [] });
    } catch (err: any) {
      logError('editor:get-history', err);
      return errorResponse(c, 'Failed to fetch history', 'INTERNAL_ERROR', 500);
    }
  }
);

// Assign editor to submission
app.post(
  "/make-server-07dc516a/editor/submissions/:id/assign",
  requireAuth,
  requireManagingEditor,
  async (c: AuthContext) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const { editorId } = body;
      
      if (!editorId) {
        return validationErrorResponse(c, ['editorId is required']);
      }
      
      const submission = await kv.get(`submission:${id}`);
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }
      
      submission.assignedTo = editorId;
      
      // Add history entry
      submission.history = submission.history || [];
      submission.history.push({
        action: `Assigned to editor ${editorId}`,
        timestamp: new Date().toISOString(),
        user: c.user!.email || 'Managing Editor'
      });
      
      await kv.set(`submission:${id}`, submission);
      
      return successResponse(c, { submission });
    } catch (err: any) {
      logError('editor:assign', err);
      return errorResponse(c, 'Failed to assign editor', 'INTERNAL_ERROR', 500);
    }
  }
);

// Get dashboard statistics
app.get(
  "/make-server-07dc516a/editor/stats",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const submissionIds = await kv.get('submissions:all') || [];
      
      const submissions = [];
      for (const id of submissionIds) {
        const submission = await kv.get(`submission:${id}`);
        if (submission) {
          submissions.push(submission);
        }
      }
      
      const stats = {
        totalSubmissions: submissions.length,
        pendingCount: submissions.filter(s => s.status === 'pending').length,
        queuedCount: submissions.filter(s => s.status === 'queued').length,
        publishedCount: submissions.filter(s => s.status === 'published').length,
        inIssueCount: submissions.filter(s => s.status === 'in_issue').length,
        revisionsCount: submissions.filter(s => s.status === 'revisions_requested').length,
      };
      
      return successResponse(c, { stats });
    } catch (err: any) {
      logError('editor:stats', err);
      return errorResponse(c, 'Failed to fetch stats', 'INTERNAL_ERROR', 500);
    }
  }
);

// Create new submission (writers submit their work)
app.post(
  "/make-server-07dc516a/submissions",
  rateLimit({ requests: 10, windowMs: 60000, keyPrefix: 'create_submission' }),
  requireAuth,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      const { title, content, type } = body;
      
      // Validate required fields
      if (!title || !content || !type) {
        return validationErrorResponse(c, ['title, content, and type are required']);
      }
      
      const submissionId = crypto.randomUUID();
      const submission = {
        id: submissionId,
        userId: c.user!.id,
        authorName: c.user!.user_metadata?.name || c.user!.email || 'Anonymous',
        title: sanitizeString(title),
        content: sanitizeString(content),
        type: sanitizeString(type),
        status: 'pending',
        submittedAt: new Date().toISOString(),
        rating: 0,
        internalNotes: '',
        history: [
          {
            action: 'Submitted',
            timestamp: new Date().toISOString(),
            user: c.user!.user_metadata?.name || c.user!.email || 'Anonymous'
          }
        ]
      };
      
      // Store submission
      await kv.set(`submission:${submissionId}`, submission);
      
      // Add to submissions list
      const allSubmissions = await kv.get('submissions:all') || [];
      allSubmissions.push(submissionId);
      await kv.set('submissions:all', allSubmissions);
      
      logInfo('submissions:create', `Created submission ${submissionId} by ${c.user!.id}`);
      
      return successResponse(c, { submission }, undefined, 201);
    } catch (err: any) {
      logError('submissions:create', err);
      return errorResponse(c, 'Failed to create submission', 'INTERNAL_ERROR', 500);
    }
  }
);

} // end registerAdditionalRoutes