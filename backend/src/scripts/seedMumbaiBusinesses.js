const mongoose = require("mongoose");
const Business = require("../models/Business");
const User = require("../models/User");
require("dotenv").config();

// Mumbai coordinates
const MUMBAI_COORDINATES = [72.8777, 19.076]; // [longitude, latitude]

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

async function seedMumbaiBusinesses() {
  try {
    // First, let's find or create a test owner
    let owner = await User.findOne({ email: "testowner@example.com" });

    if (!owner) {
      owner = await User.create({
        name: "Test Owner",
        email: "testowner@example.com",
        password: "password123",
        role: "business_owner",
      });
      console.log("Created test owner");
    }

    // Create array of sample businesses in Mumbai
    const businesses = [
      {
        name: "Taj Mahal Palace Hotel",
        category: "entertainment",
        description: "Iconic 5-star luxury hotel with sea views",
        address: "Apollo Bunder, Colaba, Mumbai 400001",
        location: {
          type: "Point",
          coordinates: [72.8331, 18.922], // near Colaba
        },
        phone: "+91-22-66653366",
        email: "tajmahal@example.com",
        website: "https://www.tajhotels.com",
        hours: {
          monday: "24 hours",
          tuesday: "24 hours",
          wednesday: "24 hours",
          thursday: "24 hours",
          friday: "24 hours",
          saturday: "24 hours",
          sunday: "24 hours",
        },
        owner: owner._id,
      },
      {
        name: "Leopold Cafe",
        category: "restaurant",
        description:
          "Historic cafe and restaurant known for its food and ambiance",
        address: "Colaba Causeway, Mumbai 400001",
        location: {
          type: "Point",
          coordinates: [72.8275, 18.9256], // Colaba area
        },
        phone: "+91-22-22828185",
        email: "leopold@example.com",
        website: "https://www.leopoldcafe.com",
        hours: {
          monday: "7:30 AM - 12:00 AM",
          tuesday: "7:30 AM - 12:00 AM",
          wednesday: "7:30 AM - 12:00 AM",
          thursday: "7:30 AM - 12:00 AM",
          friday: "7:30 AM - 12:00 AM",
          saturday: "7:30 AM - 12:00 AM",
          sunday: "7:30 AM - 12:00 AM",
        },
        owner: owner._id,
      },
      {
        name: "Chhatrapati Shivaji Terminus",
        category: "entertainment",
        description: "UNESCO World Heritage Site and historic railway station",
        address: "Fort, Mumbai 400001",
        location: {
          type: "Point",
          coordinates: [72.835, 18.9402], // CST area
        },
        owner: owner._id,
      },
      {
        name: "Marine Drive",
        category: "entertainment",
        description: "Iconic promenade along the Arabian Sea",
        address: "Marine Drive, Mumbai 400020",
        location: {
          type: "Point",
          coordinates: [72.8224, 18.9548], // Marine Drive
        },
        owner: owner._id,
      },
      {
        name: "Juhu Beach",
        category: "entertainment",
        description: "Popular beach known for street food and entertainment",
        address: "Juhu Tara Road, Mumbai 400049",
        location: {
          type: "Point",
          coordinates: [72.8296, 19.0883], // Juhu
        },
        owner: owner._id,
      },
      {
        name: "Gateway of India",
        category: "entertainment",
        description: "Historic monument and tourist attraction",
        address: "Apollo Bunder, Colaba, Mumbai 400001",
        location: {
          type: "Point",
          coordinates: [72.8347, 18.922], // Gateway
        },
        owner: owner._id,
      },
    ];

    // Insert the businesses
    await Business.insertMany(businesses);
    console.log(`Added ${businesses.length} businesses in Mumbai`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding businesses:", error);
    await mongoose.disconnect();
  }
}

// Run the seed function
seedMumbaiBusinesses();
