const axios = require("axios");
const PlaceReview = require("../models/PlaceReview");

// Google Places API proxy
exports.getPlacesNearby = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    console.log("Fetching places with params:", { lat, lng, radius, type });

    // Map application categories to Google Places types
    let googleType = "";
    if (type === "restaurant") {
      googleType = "restaurant";
    } else if (type === "retail") {
      googleType = "store";
    } else if (type === "service") {
      googleType = "beauty_salon";
    } else if (type === "entertainment") {
      googleType = "tourist_attraction";
    } else if (type === "health") {
      googleType = "hospital";
    }

    // Make request to Google Places API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: radius, // in meters
          type: googleType, // Use mapped type
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    console.log(`Found ${response.data.results.length} places from Google API`);

    // Map Google Places results to your app's business format
    const businesses = response.data.results.map((place) => ({
      _id: place.place_id,
      name: place.name,
      category: mapGoogleTypeToAppCategory(place.types[0]),
      description: `${place.name} is located at ${place.vicinity}`,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      address: place.vicinity,
      location: {
        coordinates: [place.geometry.location.lng, place.geometry.location.lat],
      },
      photos: place.photos
        ? [
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
          ]
        : [],
    }));

    res.status(200).json({ results: businesses });
  } catch (error) {
    console.error("Error fetching from Google Places API:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add this function to get details of a specific place
exports.getPlaceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Get both Google place details and user reviews from our DB
    const [placeResponse, userReviews] = await Promise.all([
      axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
        params: {
          place_id: id,
          fields:
            "name,rating,formatted_phone_number,formatted_address,geometry,opening_hours,photos,website,vicinity,types,reviews",
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }),
      PlaceReview.find({ placeId: id }).sort({ createdAt: -1 }),
    ]);

    if (!placeResponse.data.result) {
      return res.status(404).json({ message: "Place not found" });
    }

    const place = placeResponse.data.result;

    // Format user reviews from our database
    const formattedUserReviews = userReviews.map((review) => ({
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        name: review.userName,
        _id: review.userId,
      },
    }));

    // Combine Google reviews with our user reviews
    const allReviews = [
      ...formattedUserReviews,
      // Comment out the Google reviews if you don't want them
      /*
      ...(place.reviews
        ? place.reviews.map((review) => ({
            _id: `google-review-${review.time}`,
            rating: review.rating,
            comment: review.text,
            createdAt: new Date(review.time * 1000).toISOString(),
            user: {
              name: review.author_name,
              _id: `google-user-${review.author_name
                .replace(/\s+/g, "-")
                .toLowerCase()}`,
            },
          }))
        : []),
      */
    ];

    // Format place details as before
    const business = {
      _id: id,
      name: place.name,
      category: mapGoogleTypeToAppCategory(place.types[0]),
      description: `${place.name} is located at ${
        place.vicinity || place.formatted_address
      }`,
      address: place.vicinity || place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      location: {
        coordinates: [place.geometry.location.lng, place.geometry.location.lat],
      },
      photos: place.photos
        ? place.photos.map(
            (photo) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
          )
        : [],
      hours: place.opening_hours
        ? formatOpeningHours(place.opening_hours)
        : null,
      reviews: allReviews,
    };

    res.status(200).json(business);
  } catch (error) {
    console.error("Error fetching place details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to format opening hours
function formatOpeningHours(openingHours) {
  if (!openingHours || !openingHours.weekday_text) {
    return {
      monday: "Not available",
      tuesday: "Not available",
      wednesday: "Not available",
      thursday: "Not available",
      friday: "Not available",
      saturday: "Not available",
      sunday: "Not available",
    };
  }

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const result = {};

  openingHours.weekday_text.forEach((text, index) => {
    // The weekday_text format is "Day: hours"
    const day = days[index === 6 ? 0 : index + 1]; // Adjust for different starting day
    const hours = text.split(": ")[1];
    result[day] = hours;
  });

  return result;
}

// Helper function to map Google Place types to app categories
function mapGoogleTypeToAppCategory(googleType) {
  const typeMap = {
    // Restaurant types
    restaurant: "restaurant",
    cafe: "restaurant",
    bakery: "restaurant",
    bar: "restaurant",
    meal_delivery: "restaurant",
    meal_takeaway: "restaurant",

    // Retail types
    store: "retail",
    shopping_mall: "retail",
    clothing_store: "retail",
    shoe_store: "retail",
    electronics_store: "retail",
    furniture_store: "retail",

    // Service types
    beauty_salon: "service",
    hair_care: "service",
    laundry: "service",
    spa: "service",
    car_repair: "service",
    car_wash: "service",

    // Entertainment types
    movie_theater: "entertainment",
    amusement_park: "entertainment",
    museum: "entertainment",
    zoo: "entertainment",
    aquarium: "entertainment",
    tourist_attraction: "entertainment",

    // Health types
    hospital: "health",
    pharmacy: "health",
    doctor: "health",
    dentist: "health",
    gym: "health",
    health: "health",
  };

  return typeMap[googleType] || "service"; // Default to service
}

// Add this function to your externalApiController.js
exports.addReviewToPlace = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { rating, comment, userName } = req.body;

    console.log("Adding review to place:", {
      businessId,
      rating,
      comment,
      userName,
    });

    if (!businessId || !rating || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create and save the review to the database
    const newReview = new PlaceReview({
      placeId: businessId,
      userName: userName || "Anonymous User",
      userId: req.user?._id || `temp-user-${Date.now()}`,
      rating: parseInt(rating),
      comment,
    });

    await newReview.save();
    console.log("Saved review to database:", newReview);

    // Return a formatted review object for the frontend
    const formattedReview = {
      _id: newReview._id,
      business: businessId,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.createdAt,
      user: {
        name: newReview.userName,
        _id: newReview.userId,
      },
    };

    res.status(201).json(formattedReview);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
};
