import { projectId, publicAnonKey } from '/utils/supabase/info';

export function getApiUrl(path: string): string {
  return `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a${path}`;
}

export async function apiRequest(
  path: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
    ...options.headers,
  };

  return fetch(getApiUrl(path), {
    ...options,
    headers,
  });
}
