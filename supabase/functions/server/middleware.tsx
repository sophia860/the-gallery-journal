// Middleware for authentication, authorization, rate limiting, and error handling

import { Context, Next } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { errorResponse, logError } from "./utils.tsx";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Extended context type with user data
export interface AuthContext extends Context {
  user?: any;
  room?: any;
}

// Authentication middleware - validates token and fetches user
export async function requireAuth(c: AuthContext, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(c, 'Missing or invalid authorization header', 'UNAUTHORIZED', 401);
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return errorResponse(c, 'Invalid or expired token', 'UNAUTHORIZED', 401);
    }
    
    // Attach user to context
    c.user = user;
    
    // Fetch user's room/profile
    try {
      const room = await kv.get(`room:${user.id}`);
      c.room = room;
    } catch (err) {
      logError('requireAuth:fetchRoom', err);
      // Continue even if room fetch fails
    }
    
    await next();
  } catch (err) {
    logError('requireAuth', err);
    return errorResponse(c, 'Authentication failed', 'AUTH_ERROR', 401);
  }
}

// Editor role middleware - requires user to be editor or managing_editor
export async function requireEditor(c: AuthContext, next: Next) {
  if (!c.user) {
    return errorResponse(c, 'Authentication required', 'UNAUTHORIZED', 401);
  }
  
  const role = c.user.user_metadata?.role || 'writer';
  
  if (role !== 'editor' && role !== 'managing_editor') {
    return errorResponse(c, 'Editor role required', 'FORBIDDEN', 403);
  }
  
  await next();
}

// Managing editor role middleware
export async function requireManagingEditor(c: AuthContext, next: Next) {
  if (!c.user) {
    return errorResponse(c, 'Authentication required', 'UNAUTHORIZED', 401);
  }
  
  const role = c.user.user_metadata?.role || 'writer';
  
  if (role !== 'managing_editor') {
    return errorResponse(c, 'Managing editor role required', 'FORBIDDEN', 403);
  }
  
  await next();
}

// Rate limiting middleware using KV store
interface RateLimitConfig {
  requests: number;
  windowMs: number;
  keyPrefix: string;
}

export function rateLimit(config: RateLimitConfig) {
  return async (c: Context, next: Next) => {
    // Get identifier (IP for public routes, user ID for authenticated routes)
    const identifier = c.req.header('CF-Connecting-IP') || 
                      c.req.header('X-Forwarded-For')?.split(',')[0] || 
                      'unknown';
    
    const key = `${config.keyPrefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    try {
      // Get existing rate limit data
      let rateLimitData: { requests: number[]; } = await kv.get(key) || { requests: [] };
      
      // Filter out old requests outside the window
      rateLimitData.requests = rateLimitData.requests.filter((timestamp: number) => timestamp > windowStart);
      
      // Check if limit exceeded
      if (rateLimitData.requests.length >= config.requests) {
        const oldestRequest = Math.min(...rateLimitData.requests);
        const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000);
        
        c.header('Retry-After', String(retryAfter));
        return errorResponse(c, 'Too many requests', 'RATE_LIMIT_EXCEEDED', 429, `Retry after ${retryAfter} seconds`);
      }
      
      // Add current request
      rateLimitData.requests.push(now);
      
      // Save updated data
      await kv.set(key, rateLimitData);
      
      await next();
    } catch (err) {
      logError('rateLimit', err);
      // If rate limiting fails, allow the request to proceed
      await next();
    }
  };
}

// Request timeout middleware
export function requestTimeout(timeoutMs = 30000) {
  return async (c: Context, next: Next) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    
    try {
      await Promise.race([next(), timeoutPromise]);
    } catch (err: any) {
      if (err.message === 'Request timeout') {
        return errorResponse(c, 'Request timed out', 'TIMEOUT', 408);
      }
      throw err;
    }
  };
}

// Global error handler middleware
export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    const requestId = c.req.header('X-Request-Id') || crypto.randomUUID();
    logError('globalErrorHandler', err, requestId);
    
    // Validation errors
    if (err.name === 'ValidationException') {
      return c.json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: err.errors,
      }, 400);
    }
    
    // Generic error response
    return errorResponse(
      c,
      'Internal server error',
      'INTERNAL_ERROR',
      500,
      err.message
    );
  }
}

// Ownership verification middleware - checks if user owns a resource
export function requireOwnership(resourceType: 'draft' | 'exhibit' | 'room') {
  return async (c: AuthContext, next: Next) => {
    if (!c.user) {
      return errorResponse(c, 'Authentication required', 'UNAUTHORIZED', 401);
    }
    
    const resourceId = c.req.param('id') || c.req.param('userId') || c.req.param('draftId') || c.req.param('exhibitId');
    
    if (!resourceId) {
      return errorResponse(c, 'Resource ID required', 'BAD_REQUEST', 400);
    }
    
    try {
      let resource: any;
      
      switch (resourceType) {
        case 'draft':
          resource = await kv.get(`draft:${resourceId}`);
          break;
        case 'exhibit':
          resource = await kv.get(`exhibit:${resourceId}`);
          break;
        case 'room':
          resource = await kv.get(`room:${resourceId}`);
          break;
      }
      
      if (!resource) {
        return errorResponse(c, `${resourceType} not found`, 'NOT_FOUND', 404);
      }
      
      // For rooms, check if the ID matches the user ID
      if (resourceType === 'room') {
        if (resource.id !== c.user.id) {
          return errorResponse(c, 'You can only modify your own room', 'FORBIDDEN', 403);
        }
      } else {
        // For other resources, check userId field
        if (resource.userId !== c.user.id) {
          return errorResponse(c, `You can only modify your own ${resourceType}`, 'FORBIDDEN', 403);
        }
      }
      
      await next();
    } catch (err) {
      logError(`requireOwnership:${resourceType}`, err);
      return errorResponse(c, 'Failed to verify ownership', 'INTERNAL_ERROR', 500);
    }
  };
}
