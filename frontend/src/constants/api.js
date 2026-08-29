export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  
  // Base backend URL is API_BASE_URL without /api at the end
  const backendBase = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, "") : "";
  
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // Only route /uploads/ requests to the backend server.
  // Frontend static assets (/images, /assets) stay relative to the frontend domain.
  if (cleanPath.startsWith("/uploads/")) {
    return `${backendBase}${cleanPath}`;
  }
  
  return cleanPath;
};