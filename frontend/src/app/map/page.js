"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Filter, Loader2 } from "lucide-react"; // You may need to install lucide-react
import MapSearchBar from "@/components/MapSearchBar";
import BusinessFilters from "@/components/BusinessFilters";
import BusinessList from "@/components/BusinessList";
import {
  fetchNearbyBusinesses,
  fetchRealBusinessesFromGooglePlaces,
} from "@/utils/api"; // Using our API helper

// Dynamic import of map component (client-side only)
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function MapPage() {
  const [location, setLocation] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    rating: 0,
    radius: 5, // default 5km
  });
  const [loading, setLoading] = useState(false);
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
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-title-large text-gray-900">
              Find Local Businesses
            </h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>

          <div className="relative">
            <MapSearchBar onLocationSelect={setLocation} />
            {showFilters && (
              <div className="mt-3 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
                <BusinessFilters filters={filters} setFilters={setFilters} />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded-md flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {loading && !location && (
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Loading map data...</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Map area */}
        <div className="w-full lg:w-2/3 h-full">
          {location && (
            <MapComponent
              center={location}
              businesses={businesses}
              userLocation={location}
              radius={filters.radius}
            />
          )}
        </div>

        {/* Business list */}
        <div className="hidden lg:block lg:w-1/3 overflow-y-auto p-4 border-l border-gray-200">
          <BusinessList
            businesses={businesses}
            loading={loading}
            userLocation={location}
          />
        </div>
      </div>
    </div>
  );
}
