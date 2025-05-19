"use client";

import React from "react";
import Link from "next/link";
import BusinessCard from "./BusinessCard";

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
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-10 px-6">
        <p className="text-gray-600">No businesses found in this area.</p>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your filters or search radius.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100/20">
      {businesses.map((business) => (
        <BusinessCard
          key={business.place_id || business._id}
          business={business}
          userLocation={userLocation}
        />
      ))}
    </div>
  );
}
