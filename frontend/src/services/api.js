import axios from "axios";

// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://emotune-qna4.onrender.com"
).replace(/\/+$/, "");

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

// ============================================================
// HEALTH CHECK
// ============================================================

export const checkHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    console.error(
      "Health check failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ============================================================
// MOOD DETECTION
// ============================================================

export const detectMood = async (imageFile) => {
  if (!(imageFile instanceof File)) {
    throw new Error("Please select a valid image file.");
  }

  const formData = new FormData();
  formData.append("file", imageFile, imageFile.name);

  try {
    const response = await api.post("/api/detect-mood", formData);

    const result = response.data;

    if (!result || !result.mood) {
      throw new Error("The backend response does not contain a detected mood.");
    }

    return result;
  } catch (error) {
    console.error(
      "Mood detection request failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ============================================================
// SONG RECOMMENDATIONS
// ============================================================

export const getRecommendations = async (mood) => {
  if (!mood || typeof mood !== "string") {
    throw new Error("A valid mood is required for recommendations.");
  }

  try {
    const response = await api.get(
      `/api/recommendations/${encodeURIComponent(mood.trim().toLowerCase())}`,
    );

    const result = response.data;

    if (!result || !Array.isArray(result.songs)) {
      throw new Error(
        "The backend response does not contain a valid songs array.",
      );
    }

    return result;
  } catch (error) {
    console.error(
      "Recommendations request failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;
