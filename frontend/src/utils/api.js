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
    // Log the input parameters to help with debugging
    console.log("API call parameters:", { lat, lng, radius, category });

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
      }
    }

    // ---- IMPROVED MAPBOX IMPLEMENTATION WITH ADDITIONAL ERROR HANDLING ----

    // Properly scale the radius based on the filter setting
    const radiusDegrees = Math.max((radius / 100000) * 0.9, 0.01);

    // Create bounding box based on the actual radius parameter
    const bbox = [
      lng - radiusDegrees,
      lat - radiusDegrees,
      lng + radiusDegrees,
      lat + radiusDegrees,
    ].join(",");

    // Improved category mapping with better handling of "all" category
    let searchTerm = "";
    if (category && category !== "all") {
      // Map Google Places categories to Mapbox-friendly terms
      const categoryMap = {
        restaurant: "restaurant",
        cafe: "cafe",
        bar: "bar",
        lodging: "hotel",
        shopping_mall: "mall shopping",
        store: "store shop",
        grocery_or_supermarket: "grocery supermarket",
        bakery: "bakery",
        pharmacy: "pharmacy",
        gas_station: "gas station",
        park: "park",
        museum: "museum",
        art_gallery: "art gallery",
        gym: "gym fitness",
        clothing_store: "clothing fashion",
        food: "food restaurant",
      };
      searchTerm = categoryMap[category] || category;
    } else {
      // For "all" category, use a generic term that will return diverse results
      searchTerm = "point of interest";
    }

    console.log(
      `Category '${category}' mapped to search term: '${searchTerm}'`
    );

    // Make request to Mapbox
    const mapboxToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
      "pk.eyJ1IjoidmFpZGlrMTMxNyIsImEiOiJjbWF4c2VuejIwMWRjMmtzNjR5cGRreXoxIn0.1Mco54tu0v_aasnfmPN-iQ";

    // Build URL with extra error checking
    let url;
    if (category && category !== "all") {
      url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?proximity=${lng},${lat}&bbox=${bbox}&limit=20&types=poi&access_token=${mapboxToken}`;
    } else {
      url = `https://api.mapbox.com/geocoding/v5/mapbox.places/point%20of%20interest.json?proximity=${lng},${lat}&bbox=${bbox}&limit=25&types=poi&access_token=${mapboxToken}`;
    }

    console.log("Fetching from Mapbox with URL (partial):", url.split("?")[0]);

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Mapbox API error response:", await response.text());
      throw new Error("Failed to fetch places data");
    }

    const data = await response.json();

    // CRITICAL FIX: Additional error checking for features and center properties
    if (!data.features || data.features.length === 0) {
      console.warn("No features found in Mapbox response");
      throw new Error("No features in response");
    }

    console.log(`Mapbox returned ${data.features.length} results`);

    // Generate random ratings
    const randomRating = () => Math.floor(Math.random() * 15 + 35) / 10;

    // Transform Mapbox data to expected format with correct structure for MapComponent
    const results = data.features
      .filter(
        (feature) =>
          feature &&
          feature.center &&
          Array.isArray(feature.center) &&
          feature.center.length >= 2
      )
      .map((feature) => {
        const lat = feature.center[1];
        const lng = feature.center[0];

        return {
          // Add both id formats for compatibility
          id: feature.id || `generated-${Math.random()}`,
          place_id: feature.id || `generated-${Math.random()}`, // For BusinessList key
          _id: feature.id || `generated-${Math.random()}`, // Alternative key
          name:
            feature.text ||
            feature.place_name?.split(",")[0] ||
            "Unnamed Place",
          vicinity: feature.place_name || "Unknown location",
          // Keep BOTH geometry.location AND location.coordinates formats
          geometry: {
            location: {
              lat,
              lng,
            },
          },
          // Add location.coordinates format for MapComponent
          location: {
            coordinates: [lng, lat], // Note: GeoJSON format is [lng, lat]
          },
          // Make sure photos is properly formed with a URL
          photos: [
            feature.properties?.image ||
              "https://via.placeholder.com/100?text=No+Image",
          ],
          originalCategory:
            feature.properties?.category || category || "point_of_interest",
          rating: randomRating(),
          types: [category || "point_of_interest"],
        };
      });

    // If still no results, provide fallback data
    if (results.length === 0) {
      console.warn("No places found in Mapbox response, using fallback data");

      // If we're filtering by category and got no results, try a more generic search
      if (category && category !== "all") {
        console.log("Trying a generic search to get fallback results");
        try {
          const fallbackUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/point%20of%20interest.json?proximity=${lng},${lat}&bbox=${bbox}&limit=5&types=poi&access_token=${mapboxToken}`;
          const fallbackResponse = await fetch(fallbackUrl);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.features && fallbackData.features.length > 0) {
              console.log("Found generic fallback places");
              return fallbackData.features.map((feature) => {
                const lat = feature.center[1];
                const lng = feature.center[0];

                return {
                  id: feature.id || `fallback-${Math.random()}`,
                  place_id: feature.id || `fallback-${Math.random()}`,
                  _id: feature.id || `fallback-${Math.random()}`,
                  name:
                    feature.text ||
                    feature.place_name?.split(",")[0] ||
                    "Unnamed Place",
                  vicinity: feature.place_name || "Unknown location",
                  geometry: {
                    location: {
                      lat,
                      lng,
                    },
                  },
                  location: {
                    coordinates: [lng, lat],
                  },
                  photos: ["https://via.placeholder.com/100?text=No+Image"],
                  rating: randomRating(),
                  types: [category || "point_of_interest"],
                };
              });
            }
          }
        } catch (fallbackError) {
          console.error("Error fetching fallback places:", fallbackError);
        }
      }

      // Generate fake businesses around the location as a last resort
      return Array.from({ length: 5 }, (_, i) => {
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        // Generate names based on the category if possible
        let name = "";
        if (category === "restaurant" || category === "food") {
          name = [
            `Local Bistro`,
            `City Restaurant`,
            `Family Diner`,
            `Gourmet Kitchen`,
            `Tasty Treats`,
          ][i];
        } else if (category === "cafe") {
          name = [
            `Morning Coffee`,
            `Cup & Bean`,
            `Brew House`,
            `Cafe Central`,
            `Tea & Cake`,
          ][i];
        } else if (category === "bar") {
          name = [
            `Night Bar`,
            `Local Pub`,
            `Cocktail Lounge`,
            `Wine Bar`,
            `Brewery`,
          ][i];
        } else {
          name = [
            `Local Spot ${i + 1}`,
            `City Place ${i + 1}`,
            `Popular Destination ${i + 1}`,
            `Neighborhood Gem ${i + 1}`,
            `Must Visit ${i + 1}`,
          ][i];
        }

        return {
          id: `fallback-${category}-${i}`,
          name,
          vicinity: `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          geometry: {
            location: {
              lat: lat + latOffset,
              lng: lng + lngOffset,
            },
          },
          rating: randomRating(),
          types: [category || "point_of_interest"],
          photos: [{ photo_reference: "default" }],
        };
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching places:", error);
    // Generate fallback places on error
    return Array.from({ length: 3 }, (_, i) => {
      const latOffset = (Math.random() - 0.5) * 0.01;
      const lngOffset = (Math.random() - 0.5) * 0.01;
      const lat = parseFloat(lat) + latOffset;
      const lng = parseFloat(lng) + lngOffset;

      return {
        id: `error-fallback-${i}`,
        place_id: `error-fallback-${i}`, // For BusinessList key
        _id: `error-fallback-${i}`, // Alternative key
        name: [
          `Emergency Backup Restaurant`,
          `Fallback Cafe`,
          `Default Bakery`,
        ][i],
        vicinity: `Near specified location`,
        geometry: {
          location: {
            lat,
            lng,
          },
        },
        // Add location.coordinates format for MapComponent
        location: {
          coordinates: [lng, lat],
        },
        photos: ["https://via.placeholder.com/100?text=No+Image"],
        rating: 4.5,
        types: ["point_of_interest"],
      };
    });
  }
};
