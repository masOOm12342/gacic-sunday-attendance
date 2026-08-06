const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('gacic_admin_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('gacic_admin_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('gacic_admin_token');
}

export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok && response.status === 401 && !endpoint.includes('/auth/login')) {
    // Session expired
    removeAuthToken();
    window.dispatchEvent(new Event('auth_session_expired'));
  }

  return data as T;
}
