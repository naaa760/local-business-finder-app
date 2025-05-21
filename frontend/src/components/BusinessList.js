"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BusinessCard from "./BusinessCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Loader2,
  Filter,
  ArrowUpDown,
  Map,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "./ui/button";

// Function to calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 99999; // Default large value

  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function BusinessList({ businesses, loading, userLocation }) {
  const [sortBy, setSortBy] = useState("distance"); // Options: distance, rating, name
  const [sortDirection, setSortDirection] = useState("asc"); // asc or desc
  const [view, setView] = useState("grid"); // Options: grid, list
  const [showMobileSort, setShowMobileSort] = useState(false);

  // Calculate and cache distances to avoid recalculating on each render
  const [businessesWithDistance, setBusinessesWithDistance] = useState([]);

  useEffect(() => {
    if (businesses && userLocation) {
      const withDistance = businesses.map((business) => {
        // Handle all possible coordinate formats
        const businessLat =
          business.geometry?.location.lat ||
          business.location?.coordinates[1] ||
          business.location?.lat;
        const businessLng =
          business.geometry?.location.lng ||
          business.location?.coordinates[0] ||
          business.location?.lng;

        // Calculate distance if coordinates exist
        const distance = getDistance(
          userLocation.lat,
          userLocation.lng,
          businessLat,
          businessLng
        );

        return {
          ...business,
          distanceFromUser: distance,
        };
      });
      setBusinessesWithDistance(withDistance);
    } else {
      setBusinessesWithDistance(businesses || []);
    }
  }, [businesses, userLocation]);

  // Sort businesses based on the selected criteria
  const sortedBusinesses = [...businessesWithDistance].sort((a, b) => {
    const directionMultiplier = sortDirection === "asc" ? 1 : -1;

    if (sortBy === "distance") {
      return (a.distanceFromUser - b.distanceFromUser) * directionMultiplier;
    } else if (sortBy === "rating") {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return (ratingB - ratingA) * directionMultiplier; // Higher ratings first by default
    } else if (sortBy === "name") {
      const nameA = a.name || "";
      const nameB = b.name || "";
      return nameA.localeCompare(nameB) * directionMultiplier;
    }
    return 0;
  });

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      toggleSortDirection();
    } else {
      setSortBy(newSortBy);
      setSortDirection("asc");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full p-3">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-20 animate-ping"></div>
          <div className="absolute inset-[6px] rounded-full bg-white flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
          </div>
        </div>
        <p className="mt-3 text-amber-800 text-sm font-medium">
          Finding places...
        </p>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full p-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center mb-3 shadow-inner">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <MapPin className="h-5 w-5 text-amber-400" />
          </div>
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          No places found
        </h3>
        <p className="text-gray-600 text-sm max-w-xs">
          Try adjusting your search filters or exploring a different area
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with sort and view options */}
      <div className="flex items-center justify-between p-3 border-b border-amber-100">
        <div className="text-sm font-medium text-gray-700">
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="h-3 w-3 animate-spin mr-2" />
              Searching...
            </div>
          ) : (
            `${sortedBusinesses.length} places found`
          )}
        </div>

        {/* Mobile sort button - toggles the sort options */}
        <button
          className="lg:hidden flex items-center text-xs font-medium text-amber-600"
          onClick={() => setShowMobileSort(!showMobileSort)}
        >
          <ArrowUpDown className="h-3 w-3 mr-1" />
          Sort
        </button>

        {/* Desktop sort options - always visible */}
        <div className="hidden lg:flex items-center space-x-2">
          <div className="text-xs text-gray-500">Sort by:</div>

          <button
            onClick={() => handleSortChange("distance")}
            className={`text-xs px-2 py-0.5 rounded flex items-center ${
              sortBy === "distance"
                ? "bg-amber-100 text-amber-800"
                : "text-gray-600"
            }`}
          >
            Distance
            {sortBy === "distance" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="h-3 w-3 ml-1" />
              ) : (
                <ArrowDown className="h-3 w-3 ml-1" />
              ))}
          </button>

          <button
            onClick={() => handleSortChange("rating")}
            className={`text-xs px-2 py-0.5 rounded flex items-center ${
              sortBy === "rating"
                ? "bg-amber-100 text-amber-800"
                : "text-gray-600"
            }`}
          >
            Rating
            {sortBy === "rating" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="h-3 w-3 ml-1" />
              ) : (
                <ArrowDown className="h-3 w-3 ml-1" />
              ))}
          </button>

          <button
            onClick={() => handleSortChange("name")}
            className={`text-xs px-2 py-0.5 rounded flex items-center ${
              sortBy === "name"
                ? "bg-amber-100 text-amber-800"
                : "text-gray-600"
            }`}
          >
            Name
            {sortBy === "name" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="h-3 w-3 ml-1" />
              ) : (
                <ArrowDown className="h-3 w-3 ml-1" />
              ))}
          </button>

          <div className="flex border rounded overflow-hidden ml-1">
            <button
              onClick={() => setView("grid")}
              className={`p-1 ${
                view === "grid" ? "bg-amber-500 text-white" : "bg-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1 ${
                view === "list" ? "bg-amber-500 text-white" : "bg-white"
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sort options - conditionally visible */}
      {showMobileSort && (
        <div className="lg:hidden grid grid-cols-3 gap-1 p-2 bg-amber-50 border-b border-amber-100">
          <button
            onClick={() => handleSortChange("distance")}
            className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
              sortBy === "distance"
                ? "bg-amber-500 text-white"
                : "bg-white border border-amber-200"
            }`}
          >
            Distance
            {sortBy === "distance" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="h-3 w-3 ml-1" />
              ) : (
                <ArrowDown className="h-3 w-3 ml-1" />
              ))}
          </button>

          <button
            onClick={() => handleSortChange("rating")}
            className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
              sortBy === "rating"
                ? "bg-amber-500 text-white"
                : "bg-white border border-amber-200"
            }`}
          >
            Rating
            {sortBy === "rating" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="h-3 w-3 ml-1" />
              ) : (
                <ArrowDown className="h-3 w-3 ml-1" />
              ))}
          </button>

          <button
            onClick={() => handleSortChange("name")}
            className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
              sortBy === "name"
                ? "bg-amber-500 text-white"
                : "bg-white border border-amber-200"
            }`}
          >
            Name
            {sortBy === "name" &&
              (sortDirection === "asc" ? (
                <ArrowUp className="h-3 w-3 ml-1" />
              ) : (
                <ArrowDown className="h-3 w-3 ml-1" />
              ))}
          </button>
        </div>
      )}

      {/* Business cards with improved spacing */}
      <div className="flex-1 overflow-y-auto p-1 bg-amber-50/30">
        <AnimatePresence>
          <div
            className={`${
              view === "grid"
                ? "grid grid-cols-1 gap-2.5"
                : "flex flex-col space-y-2"
            }`}
          >
            {sortedBusinesses.length > 0 ? (
              sortedBusinesses.map((business, index) => (
                <motion.div
                  key={business.place_id || business._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.02,
                    ease: "easeOut",
                  }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <BusinessCard
                    business={business}
                    userLocation={userLocation}
                    displayStyle={view}
                    distance={business.distanceFromUser}
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-amber-100 p-3 rounded-full mb-3">
                  <Search className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-gray-700 font-medium mb-1">
                  No places found
                </h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your filters or search in a different area
                </p>
              </div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
