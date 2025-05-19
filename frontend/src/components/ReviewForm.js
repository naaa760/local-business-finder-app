"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { submitReview } from "@/utils/api";

export default function ReviewForm({ businessId, onReviewSubmitted }) {
  const { isSignedIn } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      setError("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await submitReview(businessId, rating, comment);
      setRating(0);
      setComment("");
      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      {!isSignedIn && (
        <p className="mb-4 text-sm text-gray-600">
          Please sign in to leave a review.
        </p>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Your Rating:</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-2xl focus:outline-none"
            >
              <span
                className={`${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-gray-700 mb-2">
          Your Review:
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Share your experience with this business..."
          disabled={!isSignedIn}
        />
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      {success && (
        <div className="mb-4 text-green-500 text-sm">
          Your review has been submitted successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !isSignedIn}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
