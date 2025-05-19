"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Search, Filter, Loader2 } from "lucide-react"; // You may need to install lucide-react
import MapSearchBar from "@/components/MapSearchBar";
import BusinessFilters from "@/components/BusinessFilters";
import BusinessList from "@/components/BusinessList";
import {
  fetchNearbyBusinesses,
  fetchRealBusinessesFromGooglePlaces,
} from "@/utils/api"; // Using our API helper
import { Button } from "@/components/ui/button";

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
    radius: 5, // default 5km
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

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
          // Default to a common location if geolocation fails
          setLocation({ lat: 40.7128, lng: -74.006 }); // New York
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
      // Send the category to the backend
      const data = await fetchRealBusinessesFromGooglePlaces(
        location.lat,
        location.lng,
        filters.radius * 1000, // convert km to meters
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

  // Add this effect to trigger a new search when filters change
  useEffect(() => {
    if (location) {
      searchBusinesses();
    }
  }, [filters, location]);

  return (
    <div className="min-h-screen relative">
      {/* Rich Gradient Background with Brown tones */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-yellow-50 to-stone-200 opacity-90" />
      <div className="fixed inset-0 bg-gradient-to-br from-amber-200/30 via-yellow-100/30 to-stone-300/30" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-brown-900/10 via-amber-800/5 to-stone-900/15" />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Glassmorphic Navbar */}
        <nav className="mx-6 mt-6 bg-white/50 backdrop-blur-xl rounded-2xl shadow-sm border border-white/40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-800 font-bold text-xl hover:text-blue-600 transition-colors"
              >
                Local Business Finder
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/map"
                  className="text-blue-600 border-b-2 border-blue-600 pb-1 font-medium"
                >
                  Explore Map
                </Link>
                {isSignedIn && (
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Profile
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 rounded-full",
                    },
                  }}
                />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="lg">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="default" size="lg">
                      Sign Up →
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Enhanced Map Page Content */}
        <div className="flex flex-col h-[calc(100vh-7rem)] mx-6 mt-6">
          {/* Glassmorphic Search Section */}
          <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-sm p-6 mb-6 border border-white/40">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="w-full md:w-2/3">
                  <MapSearchBar
                    onLocationSelect={setLocation}
                    className="w-full rounded-full shadow hover:shadow-md transition-shadow bg-white/80"
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <BusinessFilters
                    filters={filters}
                    setFilters={setFilters}
                    className="rounded-xl bg-white/80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Map and Business List Container with better layout */}
          <div className="flex gap-6 flex-1 min-h-0">
            {" "}
            {/* Add min-h-0 to prevent flex growing */}
            {/* Left Side: Map Container */}
            <div className="flex-1 flex flex-col rounded-2xl overflow-hidden shadow-lg border border-white/40 bg-white/50 backdrop-blur-xl">
              {/* Map Header */}
              <div className="p-4 border-b border-white/30 bg-white/60">
                <h2 className="text-lg font-semibold text-gray-800">
                  Interactive Map
                </h2>
                <p className="text-sm text-gray-600">
                  Explore businesses in your area
                </p>
              </div>

              {/* Map Component */}
              <div className="flex-1 relative min-h-0">
                {" "}
                {/* Add min-h-0 to allow proper scrolling */}
                {loading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                      <p className="mt-4 text-gray-600">
                        Finding the best places around you...
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
                    className="h-full w-full"
                  />
                )}
              </div>
            </div>
            {/* Right Side: Business List */}
            <div className="w-[420px] hidden lg:flex flex-col rounded-2xl shadow-lg overflow-hidden border border-white/40">
              {/* List Header */}
              <div className="p-4 border-b border-white/30 bg-white/60 backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-gray-800">
                  Nearby Businesses
                </h2>
                <p className="text-sm text-gray-600">
                  {businesses.length} places found
                </p>
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-xl custom-scrollbar">
                <BusinessList
                  businesses={businesses}
                  loading={loading}
                  userLocation={location}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
