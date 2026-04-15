import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function apiCall<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? 'Erro na requisição', body.code);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const body = await res.json();
  // A API retorna { success: true, data: ... } — extraímos o data
  return body.data !== undefined ? body.data : body;
}

// Helpers convenientes
export const api = {
  get:    <T>(path: string)                  => apiCall<T>(path, { method: 'GET' }),
  post:   <T>(path: string, body: unknown)   => apiCall<T>(path, { method: 'POST',  body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)   => apiCall<T>(path, { method: 'PUT',   body: JSON.stringify(body) }),
  delete: <T>(path: string)                  => apiCall<T>(path, { method: 'DELETE' }),
};
