"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "./ui/button";

// Function to calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
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
  const [view, setView] = useState("grid"); // Options: grid, list

  // Sort businesses based on the selected criteria
  const sortedBusinesses = [...businesses].sort((a, b) => {
    if (sortBy === "distance" && userLocation) {
      const distanceA = getDistance(
        userLocation.lat,
        userLocation.lng,
        a.geometry?.location.lat || a.location?.coordinates[1],
        a.geometry?.location.lng || a.location?.coordinates[0]
      );
      const distanceB = getDistance(
        userLocation.lat,
        userLocation.lng,
        b.geometry?.location.lat || b.location?.coordinates[1],
        b.geometry?.location.lng || b.location?.coordinates[0]
      );
      return distanceA - distanceB;
    } else if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else {
      // Sort by name
      return (a.name || "").localeCompare(b.name || "");
    }
  });

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
    <div className="h-full flex flex-col">
      {/* Even more compact toolbar */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/30 py-1 px-2 border-b border-amber-100 flex items-center justify-between text-xs">
        <div className="text-amber-800 font-medium text-[10px]">
          {businesses.length} places
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-[10px] border border-amber-200 rounded py-0.5 px-1 bg-white text-gray-700 focus:outline-none"
          >
            <option value="distance">Distance</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>

          <div className="flex bg-white rounded border border-amber-200 p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`px-1 py-0.5 rounded text-[10px] ${
                view === "grid" ? "bg-amber-500 text-white" : "text-gray-500"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-1 py-0.5 rounded text-[10px] ${
                view === "list" ? "bg-amber-500 text-white" : "text-gray-500"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

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
            {sortedBusinesses.map((business, index) => (
              <motion.div
                key={business.place_id || business._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.02, // Even faster animation
                  ease: "easeOut",
                }}
                exit={{ opacity: 0, y: -10 }}
              >
                <BusinessCard
                  business={business}
                  userLocation={userLocation}
                  displayStyle={view}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
