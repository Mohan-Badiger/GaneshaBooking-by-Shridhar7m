export const getFullImageUrl = (url) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800';
  if (!url) return fallbackImage;
  if (url.startsWith('http')) return url;

  const rawBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
  // Remove trailing slash if present
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  // Ensure path starts with /
  const path = url.startsWith('/') ? url : `/${url}`;

  return `${baseUrl}${path}`;
};

export const getBaseApiUrl = () => {
  const rawBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
  // Remove trailing slash if present
  return rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
};
