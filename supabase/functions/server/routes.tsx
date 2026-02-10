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

// ============ SUBMISSIONS ROUTES ============

app.post(
  "/make-server-07dc516a/submissions",
  rateLimit({ requests: 10, windowMs: 60000, keyPrefix: 'create_submission' }),
  requireAuth,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateRequired({
        draftId: body.draftId,
      });
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { draftId, openCallId } = body;
      
      const draft = await kv.get(`draft:${draftId}`);
      if (!draft || draft.userId !== c.user!.id) {
        return errorResponse(c, 'Draft not found or unauthorized', 'NOT_FOUND', 404);
      }

      const room = await kv.get(`room:${c.user!.id}`);
      
      const submissionId = crypto.randomUUID();
      const submission = {
        id: submissionId,
        draftId,
        userId: c.user!.id,
        authorName: room?.writerName || 'Unknown',
        title: draft.title,
        content: draft.content,
        type: draft.type,
        status: 'pending',
        openCallId: openCallId || null,
        editorNotes: '',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`submission:${submissionId}`, submission);
      
      const allSubmissions = await kv.get('all_submissions') || [];
      allSubmissions.unshift(submissionId);
      await kv.set('all_submissions', allSubmissions);
      
      const userSubmissions = await kv.get(`user_submissions:${c.user!.id}`) || [];
      userSubmissions.unshift(submissionId);
      await kv.set(`user_submissions:${c.user!.id}`, userSubmissions);

      logInfo('submissions:create', `Submission created: ${submissionId}`);

      return successResponse(c, submission, undefined, 201);
    } catch (err: any) {
      logError('submissions:create', err);
      return errorResponse(c, 'Failed to submit', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get(
  "/make-server-07dc516a/submissions",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const limit = c.req.query('limit');
      const offset = c.req.query('offset');
      
      const { limit: parsedLimit, offset: parsedOffset, errors } = validatePagination(limit, offset);
      if (errors.length > 0) {
        return validationErrorResponse(c, errors);
      }

      const submissionIds = await kv.get('all_submissions') || [];
      const submissions = [];
      
      for (const id of submissionIds) {
        const submission = await kv.get(`submission:${id}`);
        if (submission) submissions.push(submission);
      }

      const { items, total } = paginate(submissions, parsedOffset, parsedLimit);

      return successResponse(c, items, {
        offset: parsedOffset,
        limit: parsedLimit,
        total,
      });
    } catch (err: any) {
      logError('submissions:list', err);
      return errorResponse(c, 'Failed to fetch submissions', 'INTERNAL_ERROR', 500);
    }
  }
);

app.put(
  "/make-server-07dc516a/submissions/:submissionId",
  rateLimit({ requests: 30, windowMs: 60000, keyPrefix: 'update_submission' }),
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const submissionId = c.req.param('submissionId');
      const updates = await c.req.json();
      
      const submission = await kv.get(`submission:${submissionId}`);
      if (!submission) {
        return errorResponse(c, 'Submission not found', 'NOT_FOUND', 404);
      }

      const updatedSubmission = {
        ...submission,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await kv.set(`submission:${submissionId}`, updatedSubmission);

      // Log activity
      const activityId = crypto.randomUUID();
      const activity = {
        id: activityId,
        editorId: c.user!.id,
        editorName: c.user!.user_metadata?.name || 'Editor',
        action: `Updated "${submission.title}" to ${updates.status || 'updated'}`,
        submissionId,
        timestamp: new Date().toISOString(),
      };
      
      await kv.set(`activity:${activityId}`, activity);
      
      const allActivities = await kv.get('all_activities') || [];
      allActivities.unshift(activityId);
      await kv.set('all_activities', allActivities.slice(0, 50));

      logInfo('submissions:update', `Submission updated: ${submissionId}`);

      return successResponse(c, updatedSubmission);
    } catch (err: any) {
      logError('submissions:update', err);
      return errorResponse(c, 'Failed to update submission', 'INTERNAL_ERROR', 500);
    }
  }
);

// ============ ISSUES ROUTES ============

app.post(
  "/make-server-07dc516a/issues",
  rateLimit({ requests: 10, windowMs: 60000, keyPrefix: 'create_issue' }),
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateRequired({
        title: body.title,
        issueNumber: body.issueNumber,
      });
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { title, issueNumber, season, coverNote, sections } = body;
      
      const issueId = crypto.randomUUID();
      const issue = {
        id: issueId,
        title: sanitizeString(title),
        issueNumber,
        season: sanitizeString(season || ''),
        coverNote: sanitizeString(coverNote || ''),
        sections: sections || [],
        published: false,
        publishedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`issue:${issueId}`, issue);
      
      const allIssues = await kv.get('all_issues') || [];
      allIssues.unshift(issueId);
      await kv.set('all_issues', allIssues);

      logInfo('issues:create', `Issue created: ${issueId}`);

      return successResponse(c, issue, undefined, 201);
    } catch (err: any) {
      logError('issues:create', err);
      return errorResponse(c, 'Failed to create issue', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get("/make-server-07dc516a/issues", async (c) => {
  try {
    const issueIds = await kv.get('all_issues') || [];
    const issues = [];
    
    for (const id of issueIds) {
      const issue = await kv.get(`issue:${id}`);
      if (issue) issues.push(issue);
    }

    return successResponse(c, issues);
  } catch (err: any) {
    logError('issues:list', err);
    return errorResponse(c, 'Failed to fetch issues', 'INTERNAL_ERROR', 500);
  }
});

app.get("/make-server-07dc516a/issues/current", async (c) => {
  try {
    const issueIds = await kv.get('all_issues') || [];
    
    for (const id of issueIds) {
      const issue = await kv.get(`issue:${id}`);
      if (issue && issue.published) {
        return successResponse(c, issue);
      }
    }

    return successResponse(c, null);
  } catch (err: any) {
    logError('issues:current', err);
    return errorResponse(c, 'Failed to fetch current issue', 'INTERNAL_ERROR', 500);
  }
});

app.put(
  "/make-server-07dc516a/issues/:issueId",
  rateLimit({ requests: 30, windowMs: 60000, keyPrefix: 'update_issue' }),
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const issueId = c.req.param('issueId');
      const updates = await c.req.json();
      
      const issue = await kv.get(`issue:${issueId}`);
      if (!issue) {
        return errorResponse(c, 'Issue not found', 'NOT_FOUND', 404);
      }

      const updatedIssue = {
        ...issue,
        ...updates,
        updatedAt: new Date().toISOString(),
        publishedAt: updates.published && !issue.published ? new Date().toISOString() : issue.publishedAt,
      };
      
      await kv.set(`issue:${issueId}`, updatedIssue);

      logInfo('issues:update', `Issue updated: ${issueId}`);

      return successResponse(c, updatedIssue);
    } catch (err: any) {
      logError('issues:update', err);
      return errorResponse(c, 'Failed to update issue', 'INTERNAL_ERROR', 500);
    }
  }
);

// ============ OPEN CALLS ROUTES ============

app.post(
  "/make-server-07dc516a/open-calls",
  rateLimit({ requests: 10, windowMs: 60000, keyPrefix: 'create_open_call' }),
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateRequired({
        title: body.title,
        theme: body.theme,
      });
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { title, theme, description, deadline, guidelines } = body;
      
      const openCallId = crypto.randomUUID();
      const openCall = {
        id: openCallId,
        title: sanitizeString(title),
        theme: sanitizeString(theme),
        description: sanitizeString(description || ''),
        deadline,
        guidelines: sanitizeString(guidelines || ''),
        active: true,
        createdAt: new Date().toISOString(),
      };

      await kv.set(`open_call:${openCallId}`, openCall);
      
      const allOpenCalls = await kv.get('all_open_calls') || [];
      allOpenCalls.unshift(openCallId);
      await kv.set('all_open_calls', allOpenCalls);

      logInfo('openCalls:create', `Open call created: ${openCallId}`);

      return successResponse(c, openCall, undefined, 201);
    } catch (err: any) {
      logError('openCalls:create', err);
      return errorResponse(c, 'Failed to create open call', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get("/make-server-07dc516a/open-calls", async (c) => {
  try {
    const openCallIds = await kv.get('all_open_calls') || [];
    const openCalls = [];
    
    for (const id of openCallIds) {
      const openCall = await kv.get(`open_call:${id}`);
      if (openCall && openCall.active) {
        openCalls.push(openCall);
      }
    }

    return successResponse(c, openCalls);
  } catch (err: any) {
    logError('openCalls:list', err);
    return errorResponse(c, 'Failed to fetch open calls', 'INTERNAL_ERROR', 500);
  }
});

// ============ FEATURED ROOMS ROUTES ============

app.post(
  "/make-server-07dc516a/featured",
  rateLimit({ requests: 10, windowMs: 60000, keyPrefix: 'create_featured' }),
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateRequired({
        userId: body.userId,
        editorial: body.editorial,
      });
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { userId, editorial } = body;
      
      const featuredId = crypto.randomUUID();
      const featured = {
        id: featuredId,
        userId,
        editorial: sanitizeString(editorial),
        featuredAt: new Date().toISOString(),
      };

      await kv.set(`featured:${featuredId}`, featured);
      
      const allFeatured = await kv.get('all_featured') || [];
      allFeatured.unshift(featuredId);
      await kv.set('all_featured', allFeatured.slice(0, 3));

      logInfo('featured:create', `Room featured: ${userId}`);

      return successResponse(c, featured, undefined, 201);
    } catch (err: any) {
      logError('featured:create', err);
      return errorResponse(c, 'Failed to feature room', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get("/make-server-07dc516a/featured", async (c) => {
  try {
    const featuredIds = await kv.get('all_featured') || [];
    const featured = [];
    
    for (const id of featuredIds) {
      const item = await kv.get(`featured:${id}`);
      if (item) {
        const room = await kv.get(`room:${item.userId}`);
        featured.push({ ...item, room });
      }
    }

    return successResponse(c, featured);
  } catch (err: any) {
    logError('featured:list', err);
    return errorResponse(c, 'Failed to fetch featured rooms', 'INTERNAL_ERROR', 500);
  }
});

// ============ ACTIVITIES ROUTES ============

app.get(
  "/make-server-07dc516a/activities",
  requireAuth,
  requireEditor,
  async (c: AuthContext) => {
    try {
      const activityIds = await kv.get('all_activities') || [];
      const activities = [];
      
      for (const id of activityIds) {
        const activity = await kv.get(`activity:${id}`);
        if (activity) activities.push(activity);
      }

      return successResponse(c, activities);
    } catch (err: any) {
      logError('activities:list', err);
      return errorResponse(c, 'Failed to fetch activities', 'INTERNAL_ERROR', 500);
    }
  }
);

// ============ DISCOVERY ROUTES (legacy compatibility) ============

app.get("/make-server-07dc516a/discover/rooms", async (c) => {
  try {
    const allRooms = await kv.getByPrefix('room:');
    
    const rooms = allRooms.map(room => ({
      id: room.id,
      writerName: room.writerName,
      bio: room.bio,
      atmosphere: room.atmosphere,
    }));

    return successResponse(c, rooms);
  } catch (err: any) {
    logError('discover:rooms', err);
    return errorResponse(c, 'Failed to fetch rooms', 'INTERNAL_ERROR', 500);
  }
});

// ============ MARGINALIA ROUTES (legacy compatibility) ============

app.post(
  "/make-server-07dc516a/marginalia",
  requireAuth,
  async (c: AuthContext) => {
    try {
      const body = await c.req.json();
      
      const validationErrors = validateRequired({
        pieceId: body.pieceId,
        selectedText: body.selectedText,
        note: body.note,
      });
      if (validationErrors.length > 0) {
        return validationErrorResponse(c, validationErrors);
      }

      const { pieceId, selectedText, note, position } = body;
      
      const marginaliaId = crypto.randomUUID();
      const marginalia = {
        id: marginaliaId,
        pieceId,
        userId: c.user!.id,
        selectedText: sanitizeString(selectedText),
        note: sanitizeString(note),
        position: position || 0,
        isPublic: false,
        createdAt: new Date().toISOString(),
      };

      await kv.set(`marginalia:${marginaliaId}`, marginalia);
      
      const pieceMarginalia = await kv.get(`piece_marginalia:${pieceId}`) || [];
      pieceMarginalia.push(marginaliaId);
      await kv.set(`piece_marginalia:${pieceId}`, pieceMarginalia);

      return successResponse(c, marginalia, undefined, 201);
    } catch (err: any) {
      logError('marginalia:create', err);
      return errorResponse(c, 'Failed to add marginalia', 'INTERNAL_ERROR', 500);
    }
  }
);

app.get("/make-server-07dc516a/marginalia/piece/:pieceId", async (c) => {
  try {
    const pieceId = c.req.param('pieceId');
    const marginaliaIds = await kv.get(`piece_marginalia:${pieceId}`) || [];
    
    const marginalia = [];
    for (const id of marginaliaIds) {
      const note = await kv.get(`marginalia:${id}`);
      if (note && note.isPublic) {
        marginalia.push(note);
      }
    }

    return successResponse(c, marginalia);
  } catch (err: any) {
    logError('marginalia:get', err);
    return errorResponse(c, 'Failed to fetch marginalia', 'INTERNAL_ERROR', 500);
  }
});

} // end registerAdditionalRoutes