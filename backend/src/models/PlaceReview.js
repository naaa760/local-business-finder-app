const mongoose = require("mongoose");

const placeReviewSchema = new mongoose.Schema(
  {
    placeId: {
      type: String, // Google Place ID
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userId: {
      type: String, // Could be Clerk user ID or any unique identifier
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PlaceReview", placeReviewSchema);
