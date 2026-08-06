import { getAuthToken } from './api';

/**
 * Downloads a file from an authenticated API endpoint.
 * Sends the JWT token in the Authorization header so the backend
 * does not reject the request with 401 Unauthorized.
 */
export async function downloadWithAuth(
  url: string,
  filename: string
): Promise<void> {
  const token = getAuthToken();
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const fullUrl = url.startsWith('/api') && apiBase ? `${apiBase}${url.replace('/api', '')}` : url;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Download failed (${response.status}): ${errorText}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release memory
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}
