import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// ============================================================
// HEALTH CHECK
// ============================================================

export const checkHealth = async () => {
  const response = await api.get("/health");

  return response.data;
};

// ============================================================
// MOOD DETECTION
// ============================================================

export const detectMood = async (imageFile) => {
  const formData = new FormData();

  formData.append("file", imageFile);

  const response = await api.post("/api/detect-mood", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ============================================================
// RECOMMENDATIONS
// ============================================================

export const getRecommendations = async (mood) => {
  const response = await api.get(
    `/api/recommendations/${encodeURIComponent(mood)}`,
  );

  return response.data;
};

export default api;
