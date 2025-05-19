"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MapSearchBar from "@/components/MapSearchBar";
import BusinessFilters from "@/components/BusinessFilters";
import BusinessList from "@/components/BusinessList";
import { fetchNearbyBusinesses } from "@/utils/api"; // Using our API helper

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
      console.log("Searching businesses with filters:", filters);
      const results = await fetchNearbyBusinesses(
        location.lat,
        location.lng,
        filters.radius,
        filters.category,
        filters.rating
      );
      setBusinesses(results);
    } catch (err) {
      console.error("Error searching businesses:", err);
      setError("Failed to search businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search when location or filters change
  useEffect(() => {
    if (location) {
      searchBusinesses();
    }
  }, [location, filters]);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white shadow-md z-10">
        <MapSearchBar onLocationSelect={setLocation} />
        <BusinessFilters filters={filters} setFilters={setFilters} />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Map takes 2/3 of the screen on desktop, full width on mobile */}
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

        {/* Business list takes 1/3 of the screen on desktop, hidden on mobile */}
        <div className="hidden lg:block lg:w-1/3 overflow-y-auto p-4 border-l">
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
