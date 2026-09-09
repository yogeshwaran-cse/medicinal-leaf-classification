/**
 * API Configuration
 * In development: Uses empty string '' so requests go to /api and are proxied by Vite to http://127.0.0.1:8000.
 * In production: Reads VITE_API_BASE_URL (e.g., https://ayurleaf-api.onrender.com) or defaults to '' if using rewrites/same domain.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}
