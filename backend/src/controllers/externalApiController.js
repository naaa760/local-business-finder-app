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

    // Make request to Google Places API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius: radius, // in meters
          type: type || "", // restaurant, cafe, store, etc.
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    // Map Google Places results to your app's business format
    const businesses = response.data.results.map((place) => ({
      _id: place.place_id,
      name: place.name,
      category: place.types[0],
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
