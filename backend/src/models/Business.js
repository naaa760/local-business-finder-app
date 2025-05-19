const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["restaurant", "retail", "service", "entertainment", "health"],
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    phone: String,
    email: String,
    website: String,
    hours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    photos: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create geospatial index for location-based queries
businessSchema.index({ location: "2dsphere" });

// Virtual for reviews
businessSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "business",
});

// Virtual for average rating
businessSchema.virtual("rating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;

  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

// Virtual for review count
businessSchema.virtual("reviewCount").get(function () {
  return this.reviews ? this.reviews.length : 0;
});

module.exports = mongoose.model("Business", businessSchema);
