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
  return { success: true, isFavorite: false };
};

export const checkIsFavorite = async (businessId) => {
  return false;
};

export const fetchUserBusinesses = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/businesses/owner`
  );
  if (!response.ok) throw new Error("Failed to fetch owned businesses");
  return response.json();
};

// Fix for both local and production environments
export const fetchRealBusinessesFromGooglePlaces = async (
  lat,
  lng,
  radius,
  category
) => {
  try {
    // First try the original API endpoint (for local development)
    const useBackendProxy =
      typeof window !== "undefined" && window.location.hostname === "localhost";

    if (useBackendProxy) {
      try {
        // Use backend proxy for local development
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
          }/external/places?lat=${lat}&lng=${lng}&radius=${radius}&type=${category}`
        );

        if (response.ok) {
          const data = await response.json();
          return data.results;
        }
      } catch (backendError) {
        console.warn(
          "Backend proxy failed, falling back to direct Mapbox API:",
          backendError
        );
        // Fall through to the Mapbox implementation below
      }
    }

    // Mapbox implementation for production or as fallback
    // Convert radius from meters to approximately degrees (1km ≈ 0.009 degrees)
    const radiusDegrees = Math.max(radius / 100000, 0.02); // Ensure minimum coverage

    // Create bounding box
    const bbox = [
      lng - radiusDegrees,
      lat - radiusDegrees,
      lng + radiusDegrees,
      lat + radiusDegrees,
    ].join(",");

    // Create search term based on category
    const categoryMap = {
      restaurant: "restaurant",
      cafe: "cafe",
      bar: "bar",
      lodging: "hotel",
      shopping_mall: "mall",
      store: "store",
      grocery_or_supermarket: "supermarket",
      "": "food",
    };

    const searchTerm = categoryMap[category] || category || "food";

    // Make request to Mapbox
    const mapboxToken =
      "pk.eyJ1IjoidmFpZGlrMTMxNyIsImEiOiJjbWF4c2VuejIwMWRjMmtzNjR5cGRreXoxIn0.1Mco54tu0v_aasnfmPN-iQ";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?bbox=${bbox}&limit=10&types=poi&access_token=${mapboxToken}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch places data");
    }

    const data = await response.json();

    // Generate random ratings between 3.0 and 5.0
    const randomRating = () => Math.floor(Math.random() * 20 + 30) / 10;

    // Transform Mapbox data to expected format
    const results = data.features.map((feature) => ({
      id: feature.id,
      name: feature.text || feature.place_name.split(",")[0],
      vicinity: feature.place_name,
      geometry: {
        location: {
          lat: feature.center[1],
          lng: feature.center[0],
        },
      },
      rating: randomRating(),
      types: [category || "point_of_interest"],
      photos: [
        {
          photo_reference: "default",
        },
      ],
    }));

    console.log("Found places:", results.length);
    return results;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw error;
  }
};
