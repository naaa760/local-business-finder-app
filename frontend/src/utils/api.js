// Real API implementations
export const fetchNearbyBusinesses = async (
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

export const fetchBusinessById = async (id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}`
  );
  if (!response.ok) throw new Error("Business not found");
  return response.json();
};

export const fetchBusinessReviews = async (businessId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/${businessId}/reviews`
  );
  if (!response.ok) throw new Error("Failed to fetch reviews");
  return response.json();
};

export const fetchUserFavorites = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/favorites`
  );
  if (!response.ok) throw new Error("Failed to fetch favorites");
  return response.json();
};

export const fetchUserReviews = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reviews/my-reviews`
  );
  if (!response.ok) throw new Error("Failed to fetch user reviews");
  return response.json();
};

export const submitReview = async (businessId, rating, comment) => {
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

export const toggleFavorite = async (businessId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/businesses/${businessId}/favorite/toggle`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to toggle favorite");
      throw new Error("Failed to toggle favorite");
    }

    return response.json();
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

export const checkIsFavorite = async (businessId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/businesses/${businessId}/favorite/check`,
      {
        credentials: "include", // Important for auth cookies
      }
    );

    // If not authenticated, just return not favorite instead of error
    if (response.status === 401) {
      return { isFavorite: false };
    }

    if (!response.ok) {
      console.warn(
        "Failed to check favorite status, defaulting to not favorite"
      );
      return { isFavorite: false };
    }

    return response.json();
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return { isFavorite: false }; // Default to not favorite on error
  }
};

export const fetchUserBusinesses = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/owner`
  );
  if (!response.ok) throw new Error("Failed to fetch owned businesses");
  return response.json();
};

// Add this new function to fetch real business data from Google Places
export const fetchRealBusinessesFromGooglePlaces = async (
  lat,
  lng,
  radius,
  category
) => {
  try {
    // Call Google Places API through your backend proxy to protect API key
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/external/places?lat=${lat}&lng=${lng}&radius=${radius}&type=${category}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch places data");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching from Google Places:", error);
    throw error;
  }
};
