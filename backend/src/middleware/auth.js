const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - only authenticated users can access
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized to access this route" });
  }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Not authorized to perform this action" });
    }
    next();
  };
};
