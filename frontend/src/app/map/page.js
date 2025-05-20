"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Search, Filter, Loader2, MapPin } from "lucide-react"; // You may need to install lucide-react
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
    <main className="min-h-screen relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-yellow-50 to-stone-200">
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-200/30 via-yellow-100/30 to-stone-300/30" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-brown-900/10 via-amber-800/5 to-stone-900/15" />

      {/* Main Content */}
      <div className="relative z-10 px-6 py-4">
        {/* Enhanced Navbar */}
        <nav className="mb-6">
          <div className="mx-auto max-w-5xl px-4">
            <div
              className="bg-white/30 backdrop-blur-md rounded-full shadow-sm border border-white/40 
              px-6 py-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-gray-800 font-semibold text-lg hover:text-black transition-colors"
                >
                  Local Business Finder
                </Link>
                <div className="hidden md:flex gap-4">
                  <Link
                    href="/map"
                    className="px-4 py-1.5 rounded-full bg-black/5 text-black font-medium"
                  >
                    Explore Map
                  </Link>
                  {isSignedIn && (
                    <Link
                      href="/profile"
                      className="px-4 py-1.5 rounded-full text-gray-600 hover:bg-black/5"
                    >
                      Profile
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isSignedIn ? (
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: { avatarBox: "h-8 w-8 rounded-full" },
                    }}
                  />
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full hover:bg-black/5"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-full bg-black hover:bg-gray-900"
                      >
                        Sign Up →
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Beautiful Search Section */}
        <div className="mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
            Discover Local Businesses
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Find the best places around you, from restaurants to services
          </p>

          {/* Search Bar and Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Input with Better Icon Alignment */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <MapPin className="w-5 h-5 text-gray-400" strokeWidth={2} />
              </div>
              <MapSearchBar
                onLocationSelect={setLocation}
                placeholder="Search for a location..."
                className="w-full h-12 pl-11 pr-4 rounded-full border border-gray-200 
                  bg-white shadow-sm transition-all hover:shadow-md focus:outline-none 
                  focus:ring-2 focus:ring-black/5 focus:border-gray-300 text-gray-700
                  placeholder:text-gray-400"
              />
            </div>

            {/* Use My Location Button - Keep only this one */}
            <Button
              variant="outline"
              className="h-12 px-6 rounded-full border border-gray-200 text-gray-700 
                hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap"
              onClick={() => {
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
              }}
            >
              Use My Location
            </Button>

            {/* Black Search Button */}
            <Button
              variant="default"
              className="h-12 px-8 rounded-full bg-black hover:bg-gray-900 text-white 
                shadow-md hover:shadow-lg transition-all duration-200"
              onClick={searchBusinesses}
            >
              Search
            </Button>
          </div>

          {/* Filters Row with Rounded Corners */}
          <div className="flex justify-center gap-4 mt-4">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="h-10 px-4 rounded-full border border-gray-200 bg-white text-gray-700
                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
            >
              <option value="all">All Categories</option>
              <option value="restaurant">Restaurants</option>
              <option value="cafe">Cafes</option>
              <option value="retail">Retail</option>
              <option value="service">Services</option>
              <option value="store">Stores</option>
            </select>

            <select
              value={filters.rating}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  rating: Number(e.target.value),
                }))
              }
              className="h-10 px-4 rounded-full border border-gray-200 bg-white text-gray-700
                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
            >
              <option value="0">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>

            <select
              value={filters.radius}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  radius: Number(e.target.value),
                }))
              }
              className="h-10 px-4 rounded-full border border-gray-200 bg-white text-gray-700
                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
            </select>
          </div>
        </div>

        {/* Map and Business List Container */}
        <div className="flex gap-6 h-[calc(100vh-16rem)]">
          {/* Enhanced Map Container with more rounded corners */}
          <div className="flex-1 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl border border-white/40 shadow-lg">
            <div className="h-full relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent" />
                    <p className="mt-4 text-amber-800 font-medium">
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
                />
              )}
            </div>
          </div>

          {/* Enhanced Business List with more rounded corners */}
          <div className="w-[480px] hidden lg:flex flex-col rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl border border-white/40 shadow-lg">
            <div className="p-6 border-b border-amber-100/20 bg-white/60">
              <h2 className="text-xl font-semibold text-gray-800">
                Places Near You
              </h2>
              <p className="text-gray-600 mt-1">
                {businesses.length} amazing places found
              </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <BusinessList
                businesses={businesses}
                loading={loading}
                userLocation={location}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
