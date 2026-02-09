// Input validation utilities

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationException extends Error {
  public errors: ValidationError[];
  
  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.errors = errors;
  }
}

export function validateEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }
  
  return errors;
}

export function validateRequired(fields: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') {
      errors.push({ field: key, message: `${key} is required` });
    }
  }
  
  return errors;
}

export function validateUUID(id: string, fieldName = 'id'): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!id || !uuidRegex.test(id)) {
    errors.push({ field: fieldName, message: `${fieldName} must be a valid UUID` });
  }
  
  return errors;
}

export function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  
  // Trim whitespace
  let sanitized = str.trim();
  
  // Basic XSS prevention - remove script tags and event handlers
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  return sanitized;
}

export function validateStringLength(str: string, min: number, max: number, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (str.length < min) {
    errors.push({ field: fieldName, message: `${fieldName} must be at least ${min} characters` });
  }
  
  if (str.length > max) {
    errors.push({ field: fieldName, message: `${fieldName} must not exceed ${max} characters` });
  }
  
  return errors;
}

export function validateSignup(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  errors.push(...validateRequired({
    email: data.email,
    password: data.password,
    name: data.name,
  }));
  
  if (data.email && !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }
  
  if (data.password) {
    errors.push(...validatePassword(data.password));
  }
  
  if (data.name) {
    errors.push(...validateStringLength(data.name, 1, 100, 'name'));
  }
  
  return errors;
}

export function validateDraft(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  errors.push(...validateRequired({
    content: data.content,
  }));
  
  if (data.title) {
    errors.push(...validateStringLength(data.title, 0, 200, 'title'));
  }
  
  if (data.content) {
    errors.push(...validateStringLength(data.content, 1, 50000, 'content'));
  }
  
  const validTypes = ['prose', 'poetry', 'essay', 'longform', 'concrete'];
  if (data.type && !validTypes.includes(data.type)) {
    errors.push({ field: 'type', message: 'Invalid type. Must be one of: prose, poetry, essay, longform, concrete' });
  }
  
  return errors;
}

export function validateExhibit(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  errors.push(...validateRequired({
    title: data.title,
  }));
  
  if (data.title) {
    errors.push(...validateStringLength(data.title, 1, 200, 'title'));
  }
  
  if (data.openingNote) {
    errors.push(...validateStringLength(data.openingNote, 0, 5000, 'openingNote'));
  }
  
  return errors;
}

export function validatePagination(limit?: string, offset?: string): { limit: number; offset: number; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  let parsedLimit = 20; // default
  let parsedOffset = 0; // default
  
  if (limit) {
    parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
      parsedLimit = 20;
    }
  }
  
  if (offset) {
    parsedOffset = parseInt(offset);
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      errors.push({ field: 'offset', message: 'Offset must be a non-negative integer' });
      parsedOffset = 0;
    }
  }
  
  return { limit: parsedLimit, offset: parsedOffset, errors };
}
