const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const businessRoutes = require("./routes/businesses");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const externalApiRoutes = require("./routes/externalApi");

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security and middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "https://local-business-finder-app-khp8.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// Root route for health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

// API routes
app.use("/api/businesses", businessRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/external", externalApiRoutes);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Only start listening after successful connection
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit with failure
  }
};

// Connect to database
connectDB();

// Export for Vercel
module.exports = app;
