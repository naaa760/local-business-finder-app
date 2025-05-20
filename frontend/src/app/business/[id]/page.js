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
import { MapPin, Star, Phone, Globe, Heart } from "lucide-react";

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
        if (!response.ok) throw new Error("Failed to fetch business");
        const data = await response.json();
        setBusiness(data);

        // Fetch reviews if available
        try {
          const reviewsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/reviews`
          );
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
          }
        } catch (err) {
          console.log("No reviews available");
        }

        // Check if business is favorited
        if (isSignedIn) {
          try {
            const favoriteData = await checkIsFavorite(id);
            setIsFavorite(favoriteData.isFavorite);
          } catch (err) {
            console.error("Error checking favorite status:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching business:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id, isSignedIn]);

  const handleToggleFavorite = async () => {
    if (!isSignedIn) {
      alert("Please sign in to save favorites");
      return;
    }

    try {
      const result = await toggleFavorite(id);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Business
          </h1>
          <p className="text-gray-700">
            {error || "Business could not be loaded. Please try again later."}
          </p>
          <Link
            href="/map"
            className="mt-6 inline-block px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
          >
            Return to Map
          </Link>
        </div>
      </div>
    );
  }

  // Create a placeholder image if no photos
  const photos = business.photos || [];
  const mainPhoto = photos.length > 0 ? photos[0] : "/placeholder-business.jpg";

  // Format opening hours
  const formatOpeningHours = () => {
    if (!business.opening_hours?.weekday_text) {
      return <p className="text-gray-600">Hours not available</p>;
    }

    return (
      <ul className="space-y-1">
        {business.opening_hours.weekday_text.map((day, index) => (
          <li key={index} className="text-gray-600 flex">
            <span className="w-32 font-medium">{day.split(": ")[0]}</span>
            <span>{day.split(": ")[1]}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Format price level
  const getPriceLevel = () => {
    if (!business.price_level) return null;
    const priceString = "₹".repeat(business.price_level);
    return <span className="text-green-700 font-medium">{priceString}</span>;
  };

  // Format categories
  const getCategories = () => {
    if (!business.types || business.types.length === 0) return null;

    // Filter out admin-related types and format for display
    const displayTypes = business.types
      .filter(
        (type) =>
          !["point_of_interest", "establishment", "premise"].includes(type)
      )
      .map((type) => type.replace(/_/g, " "));

    if (displayTypes.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {displayTypes.map((type, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm capitalize"
          >
            {type}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button with improved styling */}
        <Link
          href="/map"
          className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6 transition-colors"
        >
          <MapPin className="mr-2 h-4 w-4" />
          <span>Back to Map</span>
        </Link>

        {/* Main content with visual improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business header card with gradient */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              {/* Main photo with better styling */}
              <div className="relative h-80 bg-gray-100">
                {mainPhoto && (
                  <Image
                    src={mainPhoto}
                    alt={business.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                )}

                {/* Photo gallery navigation if multiple photos */}
                {photos.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    {photos.slice(0, 5).map((photo, index) => (
                      <div
                        key={index}
                        className="h-16 w-16 rounded-lg overflow-hidden border-2 border-white shadow-md cursor-pointer"
                      >
                        <Image
                          src={photo}
                          alt={`${business.name} photo ${index + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                    {photos.length > 5 && (
                      <div className="h-16 w-16 rounded-lg bg-black/50 flex items-center justify-center text-white border-2 border-white shadow-md">
                        +{photos.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Business info with improved styling */}
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {business.name}
                    </h1>
                    {getCategories()}
                  </div>
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full ${
                      isFavorite
                        ? "bg-red-100 text-red-500"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    } transition-colors`}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Heart
                      className={`h-6 w-6 ${isFavorite ? "fill-red-500" : ""}`}
                    />
                  </button>
                </div>

                {/* Rating with better stars */}
                <div className="flex items-center mt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(business.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-700">
                    {business.rating} ({business.user_ratings_total} reviews)
                  </span>
                  {getPriceLevel() && (
                    <span className="ml-4">{getPriceLevel()}</span>
                  )}
                </div>

                {/* Contact info with nicer layout */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-gray-900 font-medium">Address</h3>
                      <p className="text-gray-600">
                        {business.formatted_address}
                      </p>
                    </div>
                  </div>

                  {business.formatted_phone_number && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-gray-900 font-medium">Phone</h3>
                        <a
                          href={`tel:${business.formatted_phone_number}`}
                          className="text-amber-600 hover:text-amber-800 transition-colors"
                        >
                          {business.formatted_phone_number}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.website && (
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-gray-900 font-medium">Website</h3>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:text-amber-800 transition-colors"
                        >
                          {
                            business.website
                              .replace(/^https?:\/\/(www\.)?/, "")
                              .split("/")[0]
                          }
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hours with cleaner formatting */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Business Hours
                  </h2>
                  {formatOpeningHours()}
                </div>

                {/* Share buttons with better styling */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Share This Business
                  </h2>
                  <ShareButtons business={business} url={currentUrl} />
                </div>
              </div>
            </div>

            {/* Map with rounded corners and better styling */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <div className="h-80 rounded-xl overflow-hidden">
                {business.geometry?.location && (
                  <BusinessLocationMap
                    location={{
                      lat: business.geometry.location.lat,
                      lng: business.geometry.location.lng,
                    }}
                    businessName={business.name}
                  />
                )}
              </div>
              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${business.geometry?.location.lat},${business.geometry?.location.lng}&destination_place_id=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Right column (1/3 width) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Reviews form with cleaner styling */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Write a Review
              </h2>
              <ReviewForm
                businessId={id}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>

            {/* Reviews list with better styling */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex justify-between">
                <span>Customer Reviews</span>
                <span className="text-amber-600">{reviews.length}</span>
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">
                          {review.user?.name || "Anonymous User"}
                        </h3>
                        <span className="text-gray-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex mt-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-gray-700">{review.comment}</p>

                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => {
                            const shareText = `${
                              review.user?.name || "Anonymous"
                            }'s review of ${business.name}: ${review.comment}`;
                            navigator.clipboard.writeText(
                              `${shareText}\n\n${currentUrl}`
                            );
                            alert("Review copied to clipboard!");
                          }}
                          className="text-sm text-amber-600 hover:text-amber-800 flex items-center"
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
                <div className="bg-amber-50 rounded-xl p-6 text-center">
                  <p className="text-amber-800">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
