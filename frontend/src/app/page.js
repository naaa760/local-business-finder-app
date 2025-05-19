"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state before Clerk is loaded
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center">
        <div className="animate-pulse text-blue-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center pt-10 pb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find Local Businesses Anywhere
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover top-rated local businesses around the world with our
            interactive map
          </p>

          <div className="mt-8 flex justify-center">
            {isSignedIn ? (
              <Link
                href="/map"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all shadow-md hover:shadow-lg"
              >
                Start Exploring
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all shadow-md hover:shadow-lg">
                  Sign In to Explore
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Features</h2>
            <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
                <div className="relative pl-16">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Find Nearby Businesses
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Discover businesses around your location with our
                    interactive map.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                </div>
                <div className="relative pl-16">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Read & Write Reviews
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Share your experiences and help others find great local
                    businesses.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Z"
                    />
                  </svg>
                </div>
                <div className="relative pl-16">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Share Discoveries
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Share your favorite places with friends and family across
                    social media.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-lg shadow-xl mt-10">
          <div className="max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to discover local gems?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Join our community and start exploring the best local businesses
              around you.
            </p>
            <div className="mt-8 flex justify-center">
              {isSignedIn ? (
                <Link
                  href="/map"
                  className="px-5 py-3 bg-white text-blue-600 hover:bg-blue-50 shadow rounded-md font-medium transition-all"
                >
                  Explore Now
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button className="px-5 py-3 bg-white text-blue-600 hover:bg-blue-50 shadow rounded-md font-medium transition-all">
                    Sign Up Free
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
