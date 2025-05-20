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
      {/* Beautiful background patterns */}
      <div className="fixed inset-0 bg-pattern-topography opacity-5" />
      <div className="fixed inset-0 bg-gradient-to-br from-amber-200/30 via-yellow-100/30 to-orange-200/30" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-amber-800/5 via-amber-600/5 to-orange-800/10" />

      {/* Decorative elements */}
      <div className="fixed right-0 top-0 w-96 h-96 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="fixed left-10 bottom-10 w-64 h-64 bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-2xl" />

      {/* Main Content */}
      <div className="relative z-10 px-6 py-4 max-w-[1440px] mx-auto">
        {/* Enhanced Navbar with subtle animation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="mx-auto max-w-5xl px-4">
            <div
              className="bg-white/40 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 
              px-6 py-4 flex items-center justify-between transition-all duration-300 hover:bg-white/50 hover:shadow-md"
            >
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-amber-900 font-bold text-xl tracking-tight bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent"
                >
                  <span className="inline-flex items-center">
                    <Compass className="mr-2 h-6 w-6 text-amber-500" />
                    LocalExplorer
                  </span>
                </Link>

                <div className="hidden md:flex space-x-6">
                  <Link
                    href="/map"
                    className={`py-2 px-1 text-sm font-medium relative ${
                      pathname === "/map"
                        ? "text-amber-800"
                        : "text-gray-600 hover:text-amber-700"
                    }`}
                  >
                    <span>Explore Map</span>
                    {pathname === "/map" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
                    )}
                  </Link>

                  {/* Add other nav links here */}
                </div>
              </div>

              {/* Account Section */}
              <div className="flex items-center gap-3">
                {isSignedIn ? (
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        className="font-medium text-amber-700 hover:text-amber-800 hover:bg-amber-100/60"
                      >
                        Log in
                      </Button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                      <Button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white rounded-full px-5 py-2 shadow-md hover:shadow-lg transition-all">
                        Sign up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Beautiful Search Section - with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="relative inline-block">
                Discover Amazing Places
                <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transform translate-y-1"></span>
              </span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
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

            {/* Filter Controls with better organization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Categories Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
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
                  className="w-full h-11 px-4 py-2 rounded-lg border border-amber-200/70 bg-white/90 text-gray-700
                    focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none appearance-none
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%23d97706%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E')] 
                    bg-[length:20px_20px] bg-[right_10px_center] bg-no-repeat pr-10"
                >
                  <option value="all">All Categories</option>
                  <option value="restaurant">Restaurants</option>
                  <option value="cafe">Cafes</option>
                  <option value="retail">Retail</option>
                  <option value="service">Services</option>
                  <option value="store">Stores</option>
                  <option value="hotel">Hotels</option>
                  <option value="bar">Bars & Pubs</option>
                </select>
              </div>

              {/* Rating Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
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
                  className="w-full h-11 px-4 py-2 rounded-lg border border-amber-200/70 bg-white/90 text-gray-700
                    focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none appearance-none
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%23d97706%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E')] 
                    bg-[length:20px_20px] bg-[right_10px_center] bg-no-repeat pr-10"
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Distance Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Search Radius
                </label>
                <select
                  value={filters.radius}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      radius: Number(e.target.value),
                    }))
                  }
                  className="w-full h-11 px-4 py-2 rounded-lg border border-amber-200/70 bg-white/90 text-gray-700
                    focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none appearance-none
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%23d97706%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M6 8l4 4 4-4%22/%3E%3C/svg%3E')] 
                    bg-[length:20px_20px] bg-[right_10px_center] bg-no-repeat pr-10"
                >
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="20">20 km</option>
                  <option value="50">50 km</option>
                </select>
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

        {/* Map and Business List Container - with beautiful glass effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-22rem)]"
        >
          {/* Enhanced Map Container */}
          <div className="flex-1 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="h-full relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
                    <p className="mt-4 text-amber-800 font-medium animate-pulse">
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

              {/* Map controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-amber-50 transition-colors"
                  onClick={() => {
                    /* Zoom in function */
                  }}
                >
                  <span className="text-xl font-bold text-gray-700">+</span>
                </button>
                <button
                  className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-amber-50 transition-colors"
                  onClick={() => {
                    /* Zoom out function */
                  }}
                >
                  <span className="text-xl font-bold text-gray-700">-</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Business List with beautiful styling */}
          <div className="w-full lg:w-[420px] flex flex-col rounded-3xl overflow-hidden bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
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
