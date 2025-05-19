const express = require("express");
const router = express.Router();
const {
  getPlacesNearby,
  getPlaceDetails,
  addReviewToPlace,
} = require("../controllers/externalApiController");
const PlaceReview = require("../models/PlaceReview");
const axios = require("axios");

router.get("/places", getPlacesNearby);
router.get("/places/:id", getPlaceDetails);
router.post("/reviews/:businessId", addReviewToPlace);
router.get("/reviews/:businessId", async (req, res) => {
  try {
    const { businessId } = req.params;
    const reviews = await PlaceReview.find({ placeId: businessId }).sort({
      createdAt: -1,
    });

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        name: review.userName,
        _id: review.userId,
      },
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/photos", async (req, res) => {
  try {
    const { reference, maxwidth = 800 } = req.query;

    if (!reference) {
      return res.status(400).json({ message: "Photo reference is required" });
    }

    // Log what we're trying to fetch
    console.log(`Fetching photo with reference: ${reference}`);

    // Create the Google Places photo URL directly
    const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    // For debugging
    console.log(`Google Photo URL: ${googlePhotoUrl}`);

    // Forward the request to Google API
    const response = await axios({
      method: "get",
      url: googlePhotoUrl,
      responseType: "arraybuffer",
    });

    // Set the content type from the response
    const contentType = response.headers["content-type"];
    res.setHeader("Content-Type", contentType);

    // Send the image data
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching photo:", error);
    // Send a placeholder image instead of failing
    res.status(500).json({ message: "Failed to fetch photo" });
  }
});

module.exports = router;
