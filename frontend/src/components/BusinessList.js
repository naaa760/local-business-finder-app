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
      <div className="flex flex-col justify-center items-center h-full p-8">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-20 animate-ping"></div>
          <div className="absolute inset-[6px] rounded-full bg-white flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-amber-800 font-medium">
          Discovering amazing places...
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
        className="flex flex-col items-center justify-center h-full p-8 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center mb-4 shadow-inner">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
            <MapPin className="h-8 w-8 text-amber-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No places found
        </h3>
        <p className="text-gray-600 max-w-xs">
          Try adjusting your search filters or exploring a different area
        </p>
        <Link
          href="/map"
          className="mt-6 px-4 py-2 bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors inline-flex items-center"
        >
          <Search className="h-4 w-4 mr-2" />
          Try a new search
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-amber-50">
      {/* Toolbar with sorting and view options */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/30 p-3 border-b border-amber-100 flex items-center justify-between">
        <div className="text-sm font-medium text-amber-800">
          {businesses.length} places found
        </div>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-amber-200 rounded-lg py-1 px-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex bg-white rounded-lg border border-amber-200 p-0.5 shadow-sm">
            <button
              onClick={() => setView("grid")}
              className={`px-2 py-1 rounded-md text-xs flex items-center ${
                view === "grid"
                  ? "bg-amber-500 text-white"
                  : "text-gray-500 hover:bg-amber-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-2 py-1 rounded-md text-xs flex items-center ${
                view === "list"
                  ? "bg-amber-500 text-white"
                  : "text-gray-500 hover:bg-amber-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              List
            </button>
          </div>
        </div>
      </div>

      {/* List results with animation */}
      <AnimatePresence>
        <div
          className={`${
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
              : "divide-y divide-amber-100"
          }`}
        >
          {sortedBusinesses.map((business, index) => (
            <motion.div
              key={business.place_id || business._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              exit={{ opacity: 0, y: -10 }}
              className={view === "list" ? "py-2" : ""}
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

      {/* Footer with pagination or load more */}
      {businesses.length > 10 && (
        <div className="p-4 border-t border-amber-100 bg-amber-50/50 flex justify-center">
          <Button
            variant="outline"
            className="text-amber-700 border-amber-200 hover:bg-amber-100"
          >
            Load more results
          </Button>
        </div>
      )}
    </div>
  );
}
