const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    // Generate token
    const token = generateToken(user._id);

    // Don't send password in response
    user.password = undefined;

    res.status(201).json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Don't send password in response
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
