const Review = require("../models/Review");

// Get reviews for a business
exports.getBusinessReviews = async (req, res) => {
  try {
    const { businessId } = req.params;

    const reviews = await Review.find({ business: businessId })
      .populate("user", "name profilePicture")
      .sort("-createdAt");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a review
exports.submitReview = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { rating, comment } = req.body;

    // Create the review
    const review = await Review.create({
      business: businessId,
      user: req.user._id,
      rating,
      comment,
    });

    // Populate user info
    await review.populate("user", "name profilePicture");

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get reviews by current user
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate({
        path: "business",
        select: "name category address",
      })
      .sort("-createdAt");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
