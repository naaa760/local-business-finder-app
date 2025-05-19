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

    console.log("Received review submission:", { businessId, rating, comment });

    // For demo purposes, create a review with a temporary ID
    const review = {
      _id: `temp-review-${Date.now()}`,
      business: businessId,
      user: {
        _id: req.user._id || "temp-user",
        name: req.user.name || "Anonymous User",
      },
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    console.log("Created review:", review);

    // In a real app, you would save this to the database
    // await Review.create({...})

    res.status(201).json(review);
  } catch (error) {
    console.error("Review submission error:", error);
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
