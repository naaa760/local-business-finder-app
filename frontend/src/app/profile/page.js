"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Fetch user favorites and reviews
      Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/favorites`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reviews`),
      ])
        .then(([favoritesRes, reviewsRes]) =>
          Promise.all([favoritesRes.json(), reviewsRes.json()])
        )
        .then(([favoritesData, reviewsData]) => {
          setFavorites(favoritesData);
          setReviews(reviewsData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="mt-4 text-gray-600">
          Please sign in to view your profile.
        </p>
        <div className="mt-6">
          <Link
            href="/sign-in"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.fullName || "User"}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.fullName}</h2>
            <p className="text-gray-500">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Favorite Businesses</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500">
              You haven&apos;t saved any favorites yet.
            </p>
          ) : (
            <div className="space-y-4">
              {favorites.map((business) => (
                <div key={business._id} className="border rounded-lg p-4">
                  <h3 className="font-bold">{business.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {business.category}
                  </p>
                  <div className="mt-2">
                    <Link
                      href={`/business/${business._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">
              You haven&apos;t written any reviews yet.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{review.business.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mt-2">{review.comment}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
