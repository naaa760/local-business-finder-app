"use client";

import React from "react";
import Link from "next/link";
import BusinessCard from "./BusinessCard";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Loader2 } from "lucide-react";

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
    <AnimatePresence>
      <div className="divide-y divide-white/10 bg-gradient-to-b from-amber-50/80 to-white/80 backdrop-blur-md rounded-b-2xl shadow-inner">
        {businesses.map((business, index) => (
          <motion.div
            key={business.place_id || business._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <BusinessCard business={business} userLocation={userLocation} />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
