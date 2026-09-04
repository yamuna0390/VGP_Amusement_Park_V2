const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const uploadService = {
  uploadHomepageVideo: async (file) => {
    try {
      const formData = new FormData();
      formData.append("video", file);

      const headers = { ...getHeaders() };
      delete headers['Content-Type'];

      const response = await fetch(`${API_BASE_URL}/upload/video/homepage`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to upload video");
      }
      return data;
    } catch (error) {
      console.error("Error in uploadHomepageVideo:", error);
      throw error;
    }
  },
  
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const headers = { ...getHeaders() };
      delete headers['Content-Type'];

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw data || new Error("Failed to upload image");
      }
      return data; // contains data.url
    } catch (error) {
      console.error("Error in uploadImage:", error);
      throw error;
    }
  }
};
