const User = require("../models/User");

// Get favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      select: "name category rating reviewCount address",
      populate: {
        path: "reviews",
      },
    });

    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const { businessId } = req.params;
    const user = await User.findById(req.user._id);

    // Check if already favorited
    const isFavorited = user.favorites.includes(businessId);

    if (isFavorited) {
      // Remove from favorites
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== businessId
      );
      await user.save();

      res.status(200).json({ isFavorite: false });
    } else {
      // Add to favorites
      user.favorites.push(businessId);
      await user.save();

      res.status(200).json({ isFavorite: true });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check if business is favorited
exports.checkIsFavorite = async (req, res) => {
  try {
    const { businessId } = req.params;
    const user = await User.findById(req.user._id);

    const isFavorite = user.favorites.some(
      (id) => id.toString() === businessId
    );

    res.status(200).json({ isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
