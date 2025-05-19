"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import ReviewForm from "@/components/ReviewForm";
import { checkIsFavorite, toggleFavorite } from "@/utils/api";
import ShareButtons from "@/components/ShareButtons";

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

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL}/business/${id}`;

  useEffect(() => {
    async function fetchData() {
      try {
        // Use the external API for place details
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/external/places/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch business details");
        }

        const businessData = await response.json();
        setBusiness(businessData);

        // Set empty reviews array or use reviews from business data if available
        setReviews(businessData.reviews || []);

        // Check if favorited (only if user is signed in)
        if (isSignedIn) {
          try {
            const favoriteStatus = await checkIsFavorite(id);
            setIsFavorite(favoriteStatus.isFavorite);
          } catch (err) {
            console.log("Could not check favorite status:", err);
            // Don't fail the whole page load for this
          }
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

  useEffect(() => {
    if (business && business.photos) {
      console.log("Business photos:", business.photos);
    }
  }, [business]);

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

  const handleReviewSubmitted = async (newReview) => {
    // Add the new review to the existing reviews immediately
    setReviews([newReview, ...reviews]);

    // Also refresh business data to make sure we have the latest state
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/external/places/${id}`
      );
      if (!response.ok) throw new Error("Failed to refresh business data");
      const refreshedData = await response.json();
      setBusiness(refreshedData);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-600">
          {error || "Failed to load business details"}
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
        {/* Photo gallery/hero image */}
        <div className="relative h-64 bg-gray-200">
          {business.photos && business.photos.length > 0 ? (
            <div className="h-full w-full">
              <img
                src={business.photos[0]}
                alt={business.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {business.name}
              </h1>
              <p className="text-gray-600 capitalize mt-1">
                {business.category}
              </p>
            </div>

            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < Math.round(business.rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-500">
                ({business.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              About this Business
            </h2>
            <p className="text-gray-600">{business.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
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
                      className="text-blue-600 hover:underline"
                    >
                      {business.website.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Business Hours
              </h2>
              {business.hours && (
                <div className="grid grid-cols-1 gap-1">
                  {Object.entries(business.hours).map(([day, hours]) => (
                    <div key={day} className="flex">
                      <span className="w-28 capitalize font-medium">
                        {day}:
                      </span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              )}
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

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <ShareButtons business={business} url={currentUrl} />
      </div>

      {/* Reviews section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {business.reviews && business.reviews.length > 0 ? (
              <div className="space-y-6">
                {business.reviews.map((review) => (
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
                    <div className="mt-3 flex items-center">
                      <button
                        onClick={() => {
                          const reviewText = `"${review.comment}" - ${review.user.name}`;
                          const shareText = `Review of ${business.name}: ${reviewText}`;

                          if (navigator.share) {
                            navigator
                              .share({
                                title: `Review of ${business.name}`,
                                text: shareText,
                                url: currentUrl,
                              })
                              .catch((err) =>
                                console.log("Error sharing:", err)
                              );
                          } else {
                            // Fallback for browsers that don't support navigator.share
                            navigator.clipboard.writeText(
                              `${shareText}\n\n${currentUrl}`
                            );
                            alert("Review copied to clipboard!");
                          }
                        }}
                        className="text-sm text-gray-500 hover:text-blue-600 flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                        </svg>
                        Share this review
                      </button>
                    </div>
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
