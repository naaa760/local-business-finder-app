/**
 * API utility for making requests to the backend
 */

import * as mockApi from "./mockApi";

// Check if we should use mock API
const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

// Utility function to call either mock or real API
const apiCall = async (mockFn, realFn, ...args) => {
  if (useMockApi) {
    console.log("[MOCK API]", mockFn.name);
    return mockFn(...args);
  } else {
    console.log("[REAL API]", realFn.name);
    return realFn(...args);
  }
};

// Real API implementations
const realFetchNearbyBusinesses = async (
  lat,
  lng,
  radius,
  category,
  minRating
) => {
  const queryParams = new URLSearchParams({
    lat,
    lng,
    radius,
    category: category !== "all" ? category : "",
    minRating,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/nearby?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch nearby businesses");
  }

  return response.json();
};

const realFetchBusinessById = async (id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}`
  );
  if (!response.ok) throw new Error("Business not found");
  return response.json();
};

// Export functions that will use either mock or real API
export const fetchNearbyBusinesses = (...args) =>
  apiCall(mockApi.fetchNearbyBusinesses, realFetchNearbyBusinesses, ...args);

export const fetchBusinessById = (...args) =>
  apiCall(mockApi.fetchBusinessById, realFetchBusinessById, ...args);

export const fetchBusinessReviews = (...args) =>
  apiCall(mockApi.fetchBusinessReviews, realFetchBusinessReviews, ...args);

export const fetchUserFavorites = (...args) =>
  apiCall(mockApi.fetchUserFavorites, realFetchUserFavorites, ...args);

export const fetchUserReviews = (...args) =>
  apiCall(mockApi.fetchUserReviews, realFetchUserReviews, ...args);

export const submitReview = (...args) =>
  apiCall(mockApi.submitReview, realSubmitReview, ...args);

export const toggleFavorite = (...args) =>
  apiCall(mockApi.toggleFavorite, realToggleFavorite, ...args);

export const checkIsFavorite = (...args) =>
  apiCall(mockApi.checkIsFavorite, realCheckIsFavorite, ...args);

export const fetchUserBusinesses = (...args) =>
  apiCall(mockApi.fetchUserBusinesses, realFetchUserBusinesses, ...args);

// Define the remaining real API implementations
const realFetchBusinessReviews = async (businessId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/${businessId}/reviews`
  );
  if (!response.ok) throw new Error("Failed to fetch reviews");
  return response.json();
};

const realFetchUserFavorites = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/favorites`
  );
  if (!response.ok) throw new Error("Failed to fetch favorites");
  return response.json();
};

const realFetchUserReviews = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/reviews`
  );
  if (!response.ok) throw new Error("Failed to fetch user reviews");
  return response.json();
};

const realSubmitReview = async (businessId, rating, comment) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/${businessId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, comment }),
    }
  );

  if (!response.ok) throw new Error("Failed to submit review");
  return response.json();
};

const realToggleFavorite = async (businessId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/favorites/${businessId}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) throw new Error("Failed to toggle favorite status");
  return response.json();
};

const realCheckIsFavorite = async (businessId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/favorites/check/${businessId}`
  );
  if (!response.ok) throw new Error("Failed to check favorite status");
  return response.json();
};

const realFetchUserBusinesses = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/owner`
  );
  if (!response.ok) throw new Error("Failed to fetch owned businesses");
  return response.json();
};
