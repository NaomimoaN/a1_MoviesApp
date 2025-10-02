// API Configuration for The Movie Database (TMDb)
// Replace YOUR_API_KEY_HERE with your actual API key from https://www.themoviedb.org/

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// API Endpoints
export const API_ENDPOINTS = {
  // Movies endpoints
  MOVIES_NOW_PLAYING: `${BASE_URL}/movie/now_playing`,
  MOVIES_POPULAR: `${BASE_URL}/movie/popular`,
  MOVIES_TOP_RATED: `${BASE_URL}/movie/top_rated`,
  MOVIES_UPCOMING: `${BASE_URL}/movie/upcoming`,
  MOVIE_DETAILS: (id) => `${BASE_URL}/movie/${id}`,

  // TV endpoints
  TV_AIRING_TODAY: `${BASE_URL}/tv/airing_today`,
  TV_ON_THE_AIR: `${BASE_URL}/tv/on_the_air`,
  TV_POPULAR: `${BASE_URL}/tv/popular`,
  TV_TOP_RATED: `${BASE_URL}/tv/top_rated`,
  TV_DETAILS: (id) => `${BASE_URL}/tv/${id}`,

  // Search endpoints
  SEARCH_MOVIE: `${BASE_URL}/search/movie`,
  SEARCH_TV: `${BASE_URL}/search/tv`,
  SEARCH_MULTI: `${BASE_URL}/search/multi`,
};

// Generic API request function using native fetch
export const makeApiRequest = async (endpoint, params = {}) => {
  try {
    // Add API key to params
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params,
    });

    const url = `${endpoint}?${queryParams}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Helper function to build image URL
export const getImageUrl = (path, size = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to get placeholder image
export const getPlaceholderImage = (width = 150, height = 225) => {
  return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
};
