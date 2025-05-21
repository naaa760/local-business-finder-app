"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import {
  Search,
  Filter,
  Loader2,
  MapPin,
  Compass,
  Star,
  Menu,
  X,
} from "lucide-react";
import MapSearchBar from "@/components/MapSearchBar";
import BusinessFilters from "@/components/BusinessFilters";
import BusinessList from "@/components/BusinessList";
import {
  fetchNearbyBusinesses,
  fetchRealBusinessesFromGooglePlaces,
} from "@/utils/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Dynamic import of map component (client-side only)
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function MapPage() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [location, setLocation] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    rating: 0,
    radius: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(true);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation({ lat: 40.7128, lng: -74.006 }); // New York as fallback
        }
      );
    }
  }, []);

  const searchBusinesses = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Searching with filters:", filters);
      const data = await fetchRealBusinessesFromGooglePlaces(
        location.lat,
        location.lng,
        filters.radius * 1000,
        filters.category === "all" ? "" : filters.category
      );

      // Filter by rating if needed
      const filteredData =
        filters.rating > 0
          ? data.filter((business) => business.rating >= filters.rating)
          : data;

      setBusinesses(filteredData);
    } catch (err) {
      console.error("Error searching businesses:", err);
      setError("Failed to load businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search when filters or location change
  useEffect(() => {
    if (location) {
      searchBusinesses();
    }
  }, [filters, location]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/im.png')",
          opacity: 0.2,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Existing background patterns - layered over the image */}
      <div className="fixed inset-0 bg-pattern-topography opacity-5 z-1" />
      <div className="fixed inset-0 bg-gradient-to-br from-amber-200/30 via-yellow-100/30 to-orange-200/30 z-1" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-amber-800/5 via-amber-600/5 to-orange-800/10 z-1" />

      {/* Decorative elements */}
      <div className="fixed right-0 top-0 w-96 h-96 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full -mr-48 -mt-48 blur-3xl z-1" />
      <div className="fixed left-10 bottom-10 w-64 h-64 bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-2xl z-1" />

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 py-4 max-w-[1440px] mx-auto">
        {/* Beautiful oval transparent navbar */}
        <div className="rounded-full bg-white/80 backdrop-blur-lg border border-white/50 shadow-lg p-1.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1 px-2">
            <Link href="/" className="flex items-center">
              <MapPin className="h-5 w-5 text-amber-500" />
              <span className="ml-1 font-semibold text-gray-900 hidden sm:inline-block">
                LocalFinder
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        {/* Beautiful Search Section - Added spacing and responsive design */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-6 sm:mb-10"
        >
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              <span className="relative inline-block">
                Discover Amazing Places
                <span className="absolute -bottom-1 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transform translate-y-1"></span>
              </span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg mb-4 sm:mb-8 max-w-2xl mx-auto">
              Find the best local businesses around you — from cozy cafes to
              luxurious hotels
            </p>
          </div>

          {/* Enhanced Search Bar with beautiful styling */}
          <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="relative w-full md:flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></div>
                <MapSearchBar
                  onLocationSelect={setLocation}
                  placeholder="Search for a location..."
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-amber-200 bg-white/80 shadow-sm 
                    focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>

              {/* Use Location Button */}
              <Button
                variant="outline"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ lat: latitude, lng: longitude });
                      },
                      (error) => {
                        console.error("Error getting location:", error);
                        alert(
                          "Could not get your location. Please allow location access."
                        );
                      }
                    );
                  }
                }}
                className="w-full md:w-auto h-12 px-6 border border-amber-200 bg-white/80 text-amber-700 
                  rounded-full hover:bg-amber-50 hover:border-amber-300 transition-all"
              >
                <Compass className="mr-2 h-5 w-5" />
                Use My Location
              </Button>
            </div>

            {/* Responsive Filters Section */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 mb-6 sm:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {/* Category Filter */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full h-9 sm:h-11 px-3 sm:px-4 py-1 sm:py-2 text-sm rounded-lg border border-amber-200/70 bg-white/90 text-gray-700
                      focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none appearance-none
                      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%23d97706%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E')] 
                      bg-[length:16px_16px] sm:bg-[length:20px_20px] bg-[right_8px_center] sm:bg-[right_10px_center] bg-no-repeat pr-8 sm:pr-10"
                  >
                    <option value="all">All Categories</option>
                    <option value="restaurant">Restaurants</option>
                    <option value="cafe">Cafes</option>
                    <option value="bar">Bars</option>
                    <option value="lodging">Hotels</option>
                    <option value="shopping_mall">Shopping</option>
                    <option value="tourist_attraction">Attractions</option>
                  </select>
                </div>

                {/* Rating Filter - adjusted for mobile */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        rating: Number(e.target.value),
                      }))
                    }
                    className="w-full h-9 sm:h-11 px-3 sm:px-4 py-1 sm:py-2 text-sm rounded-lg border border-amber-200/70 bg-white/90 text-gray-700
                      focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none appearance-none
                      bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%23d97706%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E')] 
                      bg-[length:16px_16px] sm:bg-[length:20px_20px] bg-[right_8px_center] sm:bg-[right_10px_center] bg-no-repeat pr-8 sm:pr-10"
                  >
                    <option value="0">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error message display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Map and Business List Container - mobile responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-[calc(100vh-20rem)] sm:h-[calc(100vh-22rem)]"
        >
          {/* Mobile tabs for switching between map and list */}
          <div className="lg:hidden flex mb-2 border border-amber-100 rounded-full p-1 bg-white/80 backdrop-blur-sm shadow-sm">
            <button
              onClick={() => setShowMap(true)}
              className={`flex-1 py-1.5 px-3 rounded-full text-sm font-medium transition-colors ${
                showMap ? "bg-amber-500 text-white" : "text-gray-700"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setShowMap(false)}
              className={`flex-1 py-1.5 px-3 rounded-full text-sm font-medium transition-colors ${
                !showMap ? "bg-amber-500 text-white" : "text-gray-700"
              }`}
            >
              List
            </button>
          </div>

          {/* Enhanced Map Container - only shown when map tab is active on mobile */}
          <div
            className={`flex-1 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl transition-all duration-300 hover:shadow-2xl ${
              !showMap ? "hidden lg:block" : ""
            }`}
          >
            <div className="h-full relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-amber-500 border-t-transparent" />
                    <p className="mt-4 text-amber-800 font-medium animate-pulse text-sm sm:text-base">
                      Discovering amazing places...
                    </p>
                  </div>
                </div>
              )}

              {location && (
                <MapComponent
                  center={location}
                  businesses={businesses}
                  userLocation={location}
                  radius={filters.radius}
                  className="h-full w-full rounded-3xl"
                  onLoad={() => setMapLoaded(true)}
                />
              )}
            </div>
          </div>

          {/* Enhanced Business List - only shown when list tab is active on mobile */}
          <div
            className={`w-full lg:w-[420px] flex flex-col rounded-3xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl transition-all duration-300 hover:shadow-2xl ${
              showMap ? "hidden lg:flex" : ""
            }`}
          >
            <div className="p-6 border-b border-amber-100/30 bg-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Places Near You
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {businesses.length} amazing{" "}
                    {businesses.length === 1 ? "place" : "places"} found
                  </p>
                </div>

                {businesses.length > 0 && (
                  <div className="flex items-center space-x-1 bg-amber-100/50 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium text-amber-700">
                      Top Rated
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <BusinessList
                businesses={businesses}
                loading={loading}
                userLocation={location}
              />

              {businesses.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No places found
                  </h3>
                  <p className="text-gray-500 max-w-xs">
                    Try adjusting your filters or searching in a different
                    location
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
