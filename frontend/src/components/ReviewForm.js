"use client";

import { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

export default function ReviewForm({ businessId, onReviewSubmitted }) {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
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

    try {
      // Get auth token from Clerk
      const token = await getToken();

      // Prepare review data
      const reviewData = {
        rating,
        comment,
        businessId,
      };

      // Submit review with authorization
      // FIXED: Changed API endpoint to match backend structure
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/businesses/${businessId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();
      setSuccess(true);
      setComment("");
      setRating(0);

      // Call the callback to update parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(data);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isSignedIn ? (
        <div className="bg-amber-50 p-4 rounded-xl text-center">
          <p className="text-amber-800 mb-4">
            Please sign in to leave a review
          </p>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex gap-1">
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
                        ? "text-amber-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              rows="4"
              placeholder="Share your experience with this business..."
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm">
              Your review has been submitted successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:bg-amber-300"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </>
      )}
    </form>
  );
}
