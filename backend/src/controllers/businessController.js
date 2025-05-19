const Business = require("../models/Business");

// Helper function for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Get nearby businesses
exports.getNearbyBusinesses = async (req, res) => {
  try {
    const { lat, lng, radius = 5, category, minRating = 0 } = req.query;

    console.log("Search parameters:", {
      lat,
      lng,
      radius,
      category,
      minRating,
    });

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    // Convert to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInMeters = parseInt(radius) * 1000; // Convert km to meters

    console.log("Using coordinates:", longitude, latitude);

    // Build the query
    let query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
    };

    // Add category filter if provided
    if (category && category !== "all") {
      query.category = category;
    }

    console.log("MongoDB query:", JSON.stringify(query));

    // Get a count first
    const count = await Business.countDocuments(query);
    console.log(`Found ${count} businesses matching query before fetching`);

    // Execute the query
    const businesses = await Business.find(query).populate("reviews").limit(50);

    console.log(`Found ${businesses.length} businesses in database`);

    // Log the coordinates of the first few businesses for debugging
    if (businesses.length > 0) {
      console.log("Sample business coordinates:");
      businesses.slice(0, 3).forEach((b) => {
        console.log(`${b.name}: [${b.location.coordinates.join(", ")}]`);
      });
    }

    // Filter by rating if needed
    let results = businesses;
    if (minRating > 0) {
      results = businesses.filter((b) => b.rating >= minRating);
    }

    // Calculate and add the distance for each business
    results = results.map((business) => {
      const businessObj = business.toObject();

      // Calculate approximate distance in km
      const lat2 = business.location.coordinates[1];
      const lon2 = business.location.coordinates[0];
      businessObj.distance = calculateDistance(
        latitude,
        longitude,
        lat2,
        lon2
      ).toFixed(1);

      return businessObj;
    });

    // Sort by distance
    results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.status(200).json(results);
  } catch (error) {
    console.error("Error in getNearbyBusinesses:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate("reviews");

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new business
exports.createBusiness = async (req, res) => {
  try {
    // Add owner from authenticated user
    req.body.owner = req.user._id;

    const business = await Business.create(req.body);
    res.status(201).json(business);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get businesses owned by current user
exports.getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.user._id }).populate(
      "reviews"
    );
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
