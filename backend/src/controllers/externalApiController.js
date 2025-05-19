const axios = require("axios");

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

    if (!id) {
      return res.status(400).json({ message: "Place ID is required" });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: id,
          fields:
            "name,formatted_address,formatted_phone_number,website,photos,opening_hours,rating,reviews,types,url",
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    if (!response.data.result) {
      return res.status(404).json({ message: "Place not found" });
    }

    const place = response.data.result;

    // Format the place details to match your business model structure
    const formattedBusiness = {
      _id: place.place_id,
      name: place.name,
      category: mapGoogleTypeToAppCategory(place.types[0]),
      description: `${place.name} is located at ${place.formatted_address}`,
      address: place.formatted_address,
      phone: place.formatted_phone_number || "",
      website: place.website || "",
      rating: place.rating || 0,
      reviewCount: place.reviews ? place.reviews.length : 0,
      location: {
        coordinates: [
          place.geometry ? place.geometry.location.lng : 0,
          place.geometry ? place.geometry.location.lat : 0,
        ],
      },
      reviews: place.reviews
        ? place.reviews.map((review) => ({
            _id: review.time,
            rating: review.rating,
            comment: review.text,
            user: {
              name: review.author_name,
              profilePicture: review.profile_photo_url,
            },
            createdAt: new Date(review.time * 1000).toISOString(),
          }))
        : [],
      photos: place.photos
        ? place.photos
            .slice(0, 5)
            .map(
              (photo) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
            )
        : [],
      hours: formatOpeningHours(place.opening_hours),
    };

    res.status(200).json(formattedBusiness);
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
