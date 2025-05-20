"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Heart,
  Clock,
  Calendar,
  Menu,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favorites");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      async function fetchUserData() {
        try {
          setLoading(true);

          // Fetch favorites
          const favoritesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/favorites`
          );
          if (favoritesResponse.ok) {
            const favoritesData = await favoritesResponse.json();
            setFavorites(favoritesData);
          }

          // Fetch reviews
          const reviewsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/reviews/my-reviews`
          );
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchUserData();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-8">
            You need to be signed in to view your profile.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative mb-8">
          {/* Decorative element */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-300/20 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full filter blur-2xl"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            {/* Profile Header Card */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* User Avatar */}
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-amber-100">
                    {user.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName || "User"}
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl text-amber-300 font-light">
                          {user.firstName?.charAt(0) ||
                            user.username?.charAt(0) ||
                            "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 h-8 w-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user.fullName || user.username || "User"}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                    <div className="bg-amber-100/80 px-4 py-2 rounded-full flex items-center text-amber-800">
                      <Heart className="h-4 w-4 mr-2" />
                      <span>{favorites.length} Favorites</span>
                    </div>
                    <div className="bg-amber-100/80 px-4 py-2 rounded-full flex items-center text-amber-800">
                      <Star className="h-4 w-4 mr-2" />
                      <span>{reviews.length} Reviews</span>
                    </div>
                    <div className="bg-amber-100/80 px-4 py-2 rounded-full flex items-center text-amber-800">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Member since{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/map"
                    className="px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Explore Map
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex space-x-2 mb-6 bg-white/40 backdrop-blur-sm p-2 rounded-2xl">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-6 py-3 rounded-xl flex items-center ${
                activeTab === "favorites"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-gray-600 hover:bg-white/50"
              } transition-colors`}
            >
              <Heart
                className={`h-5 w-5 mr-2 ${
                  activeTab === "favorites" ? "text-amber-500" : ""
                }`}
              />
              Favorites
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 rounded-xl flex items-center ${
                activeTab === "reviews"
                  ? "bg-white text-amber-700 shadow-sm"
                  : "text-gray-600 hover:bg-white/50"
              } transition-colors`}
            >
              <Star
                className={`h-5 w-5 mr-2 ${
                  activeTab === "reviews" ? "text-amber-500" : ""
                }`}
              />
              Reviews
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-6 min-h-[400px]"
        >
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500"></div>
            </div>
          ) : activeTab === "favorites" ? (
            // Favorites Content
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Your Favorite Places
              </h2>

              {favorites.length === 0 ? (
                <div className="text-center py-16 bg-amber-50/50 rounded-2xl">
                  <Heart className="h-16 w-16 mx-auto text-amber-200" />
                  <h3 className="text-xl font-medium text-gray-700 mt-4">
                    No Favorites Yet
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    When you find businesses you love, click the heart icon to
                    add them to your favorites.
                  </p>
                  <Link
                    href="/map"
                    className="mt-6 inline-block px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                  >
                    Explore Places
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <Link
                      href={`/business/${favorite.business._id}`}
                      key={favorite._id}
                      className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden flex flex-col h-full"
                    >
                      <div className="h-40 bg-gray-200 relative">
                        {favorite.business.photos &&
                        favorite.business.photos[0] ? (
                          <Image
                            src={favorite.business.photos[0]}
                            alt={favorite.business.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-amber-100 text-amber-300">
                            <MapPin className="h-12 w-12" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full">
                          <Heart className="h-5 w-5 text-amber-500 fill-amber-500" />
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-gray-800 text-lg group-hover:text-amber-600 transition-colors">
                          {favorite.business.name}
                        </h3>

                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (favorite.business.rating || 0)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {favorite.business.rating?.toFixed(1) ||
                              "No rating"}
                          </span>
                        </div>

                        <p className="text-gray-600 mt-2 text-sm line-clamp-2 flex-1">
                          {favorite.business.formatted_address ||
                            favorite.business.address}
                        </p>

                        <div className="mt-3 text-xs text-gray-500">
                          Added on{" "}
                          {new Date(favorite.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Reviews Content
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Your Reviews
              </h2>

              {reviews.length === 0 ? (
                <div className="text-center py-16 bg-amber-50/50 rounded-2xl">
                  <FileText className="h-16 w-16 mx-auto text-amber-200" />
                  <h3 className="text-xl font-medium text-gray-700 mt-4">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    Share your experiences by writing reviews for the places
                    you&apos;ve visited.
                  </p>
                  <Link
                    href="/map"
                    className="mt-6 inline-block px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                  >
                    Find Places to Review
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <Link href={`/business/${review.business._id}`}>
                          <h3 className="font-semibold text-gray-800 text-lg hover:text-amber-600 transition-colors">
                            {review.business.name}
                          </h3>
                        </Link>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="mt-3 text-gray-700">{review.comment}</p>

                      <div className="mt-4 flex justify-end">
                        <Link
                          href={`/business/${review.business._id}`}
                          className="text-amber-600 hover:text-amber-800 text-sm flex items-center"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          View Business
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
