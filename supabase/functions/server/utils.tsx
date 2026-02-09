// Utility functions for API responses and helpers

import { Context } from "npm:hono";

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    offset?: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: string;
}

export function successResponse<T>(c: Context, data: T, meta?: SuccessResponse<T>['meta'], status = 200) {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };
  
  if (meta) {
    response.meta = meta;
  }
  
  // Add request ID header for tracking
  c.header('X-Request-Id', crypto.randomUUID());
  
  return c.json(response, status);
}

export function errorResponse(c: Context, error: string, code: string, status = 400, details?: string) {
  const response: ErrorResponse = {
    success: false,
    error,
    code,
  };
  
  if (details && Deno.env.get('ENVIRONMENT') !== 'production') {
    response.details = details;
  }
  
  // Add request ID header for tracking
  c.header('X-Request-Id', crypto.randomUUID());
  
  return c.json(response, status);
}

export function validationErrorResponse(c: Context, errors: Array<{ field: string; message: string }>) {
  return c.json({
    success: false,
    error: 'Validation failed',
    code: 'VALIDATION_ERROR',
    errors,
  }, 400);
}

export function paginate<T>(items: T[], offset: number, limit: number): { items: T[]; total: number } {
  const total = items.length;
  const paginatedItems = items.slice(offset, offset + limit);
  
  return {
    items: paginatedItems,
    total,
  };
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function logError(context: string, error: any, requestId?: string) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    requestId,
    context,
    error: error.message || String(error),
    stack: error.stack,
  };
  
  console.error(JSON.stringify(logEntry));
}

export function logInfo(context: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    context,
    message,
    data,
  };
  
  console.log(JSON.stringify(logEntry));
}

// Helper to add standard headers to responses
export function addStandardHeaders(c: Context) {
  c.header('X-Request-Id', generateRequestId());
  c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  c.header('X-Content-Type-Options', 'nosniff');
}
