import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://emotune-qna4.onrender.com"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// HEALTH CHECK
export const checkHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

// MOOD DETECTION
export const detectMood = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await api.post("/api/detect-mood", formData);

  return response.data;
};

// SONG RECOMMENDATIONS
export const getRecommendations = async (mood) => {
  const response = await api.get(
    `/api/recommendations/${encodeURIComponent(mood)}`,
  );

  return response.data;
};

export default api;
