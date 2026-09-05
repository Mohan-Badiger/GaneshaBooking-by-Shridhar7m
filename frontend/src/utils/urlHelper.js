export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800';

export const getBaseApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // In production, never inadvertently point to localhost
  if (import.meta.env.PROD) {
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }
    return typeof window !== 'undefined' ? window.location.origin : '';
  }

  // In local development, fall back to localhost:5000
  const rawBaseUrl = envUrl || 'http://localhost:5000';
  return rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
};

export const getFullImageUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  const baseUrl = getBaseApiUrl();
  const path = url.startsWith('/') ? url : `/${url}`;

  return `${baseUrl}${path}`;
};

export const handleImageError = (e) => {
  if (e && e.currentTarget && e.currentTarget.src !== FALLBACK_IMAGE) {
    e.currentTarget.onerror = null; // Prevent infinite error loops
    e.currentTarget.src = FALLBACK_IMAGE;
  }
};
