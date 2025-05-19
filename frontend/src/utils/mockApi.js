import { mockBusinesses, mockReviews, mockUserData } from "@/mocks/mockData";

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get nearby businesses with filtering
export async function fetchNearbyBusinesses(
  lat,
  lng,
  radius,
  category,
  minRating
) {
  await delay(800); // Simulate network delay

  console.log("Fetching nearby businesses with:", {
    lat,
    lng,
    radius,
    category,
    minRating,
  });

  let results = [...mockBusinesses];

  if (category && category !== "all") {
    results = results.filter((business) => business.category === category);
  }

  if (minRating > 0) {
    results = results.filter((business) => business.rating >= minRating);
  }

  // Calculate a fake distance (normally would be done by geospatial query on server)
  results = results.map((business) => {
    // Simple formula for "distance" - not actually accurate but good enough for mocking
    const dLat = Math.abs(business.location.coordinates[1] - lat);
    const dLng = Math.abs(business.location.coordinates[0] - lng);
    const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111; // Crude approximation (1 degree ≈ 111km)

    return {
      ...business,
      distance: Math.min(distance, radius).toFixed(1), // Cap at radius for believability
    };
  });

  // Filter by radius
  results = results.filter(
    (business) => parseFloat(business.distance) <= radius
  );

  // Sort by distance
  results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  console.log(`Found ${results.length} businesses`);
  return results;
}

// Get business by ID
export async function fetchBusinessById(id) {
  await delay(600);
  console.log(`Fetching business with ID: ${id}`);

  const business = mockBusinesses.find((b) => b._id === id);

  if (!business) {
    console.error(`Business with ID ${id} not found`);
    throw new Error("Business not found");
  }

  return business;
}

// Get reviews for a business
export async function fetchBusinessReviews(businessId) {
  await delay(700);
  console.log(`Fetching reviews for business: ${businessId}`);
  return mockReviews.filter((review) => review.business._id === businessId);
}

// Get user's favorite businesses
export async function fetchUserFavorites() {
  await delay(500);
  console.log("Fetching user favorites");
  return mockUserData.favorites;
}

// Get user's reviews
export async function fetchUserReviews() {
  await delay(500);
  console.log("Fetching user reviews");
  return mockUserData.reviews;
}

// Add a review
export async function submitReview(businessId, rating, comment) {
  await delay(1000);
  console.log(`Submitting review for business ${businessId}: ${rating} stars`);

  const newReview = {
    _id: `r${mockReviews.length + 1}`,
    business: mockBusinesses.find((b) => b._id === businessId),
    user: { _id: "current-user", name: "You" },
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  // In a real app, this would be saved to a database
  mockReviews.push(newReview);

  return newReview;
}

// Toggle favorite status for a business
export async function toggleFavorite(businessId) {
  await delay(500);
  console.log(`Toggling favorite status for business: ${businessId}`);

  const existingIndex = mockUserData.favorites.findIndex(
    (fav) => fav._id === businessId
  );

  if (existingIndex >= 0) {
    // Remove from favorites
    mockUserData.favorites.splice(existingIndex, 1);
    return { isFavorite: false };
  } else {
    // Add to favorites
    const business = mockBusinesses.find((b) => b._id === businessId);
    if (business) {
      const { _id, name, category, rating, reviewCount, address } = business;
      mockUserData.favorites.push({
        _id,
        name,
        category,
        rating,
        reviewCount,
        address,
      });
    }
    return { isFavorite: true };
  }
}

// Check if a business is a favorite
export async function checkIsFavorite(businessId) {
  await delay(300);
  console.log(`Checking if business ${businessId} is favorited`);
  return {
    isFavorite: mockUserData.favorites.some((fav) => fav._id === businessId),
  };
}

// Get businesses owned by the current user
export async function fetchUserBusinesses() {
  await delay(600);
  console.log("Fetching businesses owned by current user");
  // For mock data, let's say the current user owns these businesses
  return mockBusinesses
    .filter((b) => b.owner === "user1" || b.owner === "user2")
    .slice(0, 2);
}
