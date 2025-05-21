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
  Map,
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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

      {/* Main Content - Increased size and improved organization */}
      <div className="relative z-10 px-2 sm:px-4 py-2 h-screen flex flex-col">
        {/* Enhanced mobile-friendly navbar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-full bg-white/90 backdrop-blur-xl border border-white/50 shadow-lg p-1.5 mb-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-1 px-2">
            <Link href="/" className="flex items-center">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-1.5 rounded-full">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="ml-1.5 font-semibold text-gray-900 hidden sm:inline-block">
                LocalFinder
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="hidden sm:flex text-sm text-gray-600 hover:text-amber-600 px-3 py-1.5 rounded-full transition-colors"
            >
              Home
            </Link>
            <Link
              href="/map"
              className="hidden sm:flex items-center text-sm text-amber-600 font-medium bg-amber-50 px-3 py-1.5 rounded-full"
            >
              <Map className="h-3.5 w-3.5 mr-1" />
              Map
            </Link>
            <div className="ml-1">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </motion.div>

        <br />
        <br />

        {/* Improved title and description - more compact but still beautiful */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-2"
        >
          <div className="text-center mb-1">
            <h1 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 tracking-tight">
              <span className="relative inline-block px-1">
                Discover Amazing Places
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transform translate-y-1 opacity-80"></div>
              </span>
            </h1>

            <br />

            <p className="text-gray-600 text-xs sm:text-sm max-w-xl mx-auto px-3 sm:px-0">
              Find the best local businesses around you — from cozy cafes to
              hidden gems
            </p>
          </div>
        </motion.div>

        <br />
        <br />

        {/* Enhanced Map and Business listing container with improved sizing and layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden">
          {/* Left: Business search and listing - larger and more organized */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full lg:w-[420px] xl:w-[480px] h-full flex flex-col shadow-xl rounded-2xl bg-white/90 backdrop-blur-md overflow-hidden"
          >
            {/* Enhanced Search Bar with beautiful styling */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 border-b border-amber-100">
              <div className="relative mb-3">
                <MapSearchBar
                  onLocationSelect={setLocation}
                  placeholder="Search for a location..."
                  className="w-full h-11 pl-4 pr-4 rounded-full border border-amber-200 bg-white/80 shadow-sm 
                    focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Filters section - more compact but still functional */}
            <div className="px-4 py-3 border-b border-amber-100">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: filtersOpen ? "auto" : "0px",
                  opacity: filtersOpen ? 1 : 0,
                }}
                className="overflow-hidden"
              >
                <BusinessFilters filters={filters} setFilters={setFilters} />
              </motion.div>

              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center justify-between w-full py-1.5 text-sm font-medium text-amber-700"
              >
                <span className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </span>
                <div
                  className={`transform transition-transform ${
                    filtersOpen ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Business listing - larger and more spacious */}
            <div className="flex-1 overflow-hidden bg-amber-50/50">
              <BusinessList
                businesses={businesses}
                loading={loading}
                userLocation={location}
              />
            </div>
          </motion.div>

          {/* Right: Map Component - Larger and more prominent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 bg-white/30 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden h-full border border-white/50"
          >
            <MapComponent
              businesses={businesses}
              userLocation={location}
              onBusinessClick={(business) => {
                // Handle business click if needed
              }}
              className="w-full h-full rounded-xl"
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
