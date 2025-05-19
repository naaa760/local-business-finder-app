"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  fetchBusinessById,
  fetchBusinessReviews,
  checkIsFavorite,
  toggleFavorite,
} from "@/utils/mockApi";
import ReviewForm from "@/components/ReviewForm";
import { useUser } from "@clerk/nextjs";

// Dynamic import for map component (client-side only)
const BusinessLocationMap = dynamic(
  () => import("@/components/BusinessLocationMap"),
  {
    ssr: false,
  }
);

export default function BusinessDetailPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch business data
        const businessData = await fetchBusinessById(id);
        setBusiness(businessData);

        // Fetch reviews
        const reviewsData = await fetchBusinessReviews(id);
        setReviews(reviewsData);

        // Check if favorited (only if user is signed in)
        if (isSignedIn) {
          const favoriteStatus = await checkIsFavorite(id);
          setIsFavorite(favoriteStatus.isFavorite);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, isSignedIn]);

  const handleToggleFavorite = async () => {
    if (!isSignedIn) {
      // Prompt to sign in
      return;
    }

    try {
      const result = await toggleFavorite(id);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleReviewSubmitted = async () => {
    try {
      const updatedReviews = await fetchBusinessReviews(id);
      setReviews(updatedReviews);

      // Refresh business data to get updated rating
      const updatedBusiness = await fetchBusinessById(id);
      setBusiness(updatedBusiness);
    } catch (err) {
      console.error("Error refreshing reviews:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-600">{error}</p>
        <div className="mt-6">
          <Link
            href="/map"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Map
          </Link>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Business Not Found</h1>
        <p className="mt-4 text-gray-600">
          The business you are looking for does not exist.
        </p>
        <div className="mt-6">
          <Link
            href="/map"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/map" className="text-blue-600 hover:text-blue-800">
          ← Back to Map
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Hero image */}
        <div className="relative h-64 bg-gray-200">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <span>Business Image</span>
          </div>
        </div>

        {/* Business info */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {business.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1 capitalize">
                {business.category}
              </p>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.round(business.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {business.rating.toFixed(1)} ({business.reviewCount} reviews)
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full ${
                isFavorite
                  ? "text-red-500 hover:bg-red-100"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill={isFavorite ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <p className="mt-4 text-gray-700">{business.description}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Contact Information
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span>{" "}
                  {business.address}
                </p>
                {business.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {business.phone}
                  </p>
                )}
                {business.email && (
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {business.email}
                  </p>
                )}
                {business.website && (
                  <p className="text-gray-600">
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {business.website}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Business Hours
              </h2>
              <div className="space-y-1">
                {Object.entries(business.hours).map(([day, hours]) => (
                  <div key={day} className="flex">
                    <span className="w-24 text-gray-600 capitalize">
                      {day}:
                    </span>
                    <span className="text-gray-800">{hours || "Closed"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Location
            </h2>
            <div className="h-64 rounded-lg overflow-hidden border">
              <BusinessLocationMap
                location={{
                  lat: business.location.coordinates[1],
                  lng: business.location.coordinates[0],
                }}
                businessName={business.name}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          By {review.user.name} •{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>

          <div className="md:col-span-1">
            <ReviewForm
              businessId={id}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
