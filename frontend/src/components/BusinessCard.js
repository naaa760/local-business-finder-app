import React from "react";
import Link from "next/link";
import { MapPin, Star, Phone, Clock, Navigation, Heart } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const d = R * c;
  return d;
}

export default function BusinessCard({
  business,
  userLocation,
  displayStyle = "grid",
}) {
  const distance = userLocation
    ? getDistance(
        userLocation.lat,
        userLocation.lng,
        business.geometry?.location.lat || business.location?.coordinates[1],
        business.geometry?.location.lng || business.location?.coordinates[0]
      )
    : null;

  // Get business ID from place_id or _id
  const businessId = business.place_id || business._id;

  // Determine category color - ensure all categories are included
  const getCategoryColor = (category) => {
    const colors = {
      restaurant: "from-rose-500 to-orange-500",
      retail: "from-blue-500 to-cyan-400",
      service: "from-emerald-500 to-teal-400",
      entertainment: "from-purple-500 to-violet-400",
      health: "from-teal-500 to-green-400",
    };
    return colors[business.category] || "from-amber-500 to-yellow-400";
  };

  // Format distance for display
  const formatDistance = (dist) => {
    if (dist === undefined || dist === null) return "";
    if (dist < 1) return `${Math.round(dist * 1000)} m`;
    return `${dist.toFixed(1)} km`;
  };

  // Grid view
  if (displayStyle === "grid") {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow border border-amber-100 hover:shadow-md transition-all">
        <Link href={`/business/${businessId}`} className="block">
          {/* Two-column layout for clearer organization */}
          <div className="flex">
            {/* Left: Image column */}
            <div className="w-1/3 h-[80px] relative">
              {business.photos && business.photos.length > 0 ? (
                <Image
                  src={business.photos[0]}
                  alt={business.name}
                  width={100}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-business.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <span className="text-amber-500 font-medium text-lg">
                    {business.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Category indicator as a small badge in corner */}
              <div className="absolute bottom-0 right-0">
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(
                    business.category
                  )}`}
                ></div>
              </div>
            </div>

            {/* Right: Content column */}
            <div className="w-2/3 p-2">
              {/* Business name - clear and prominent */}
              <h3 className="font-medium text-xs text-gray-900 line-clamp-1">
                {business.name}
              </h3>

              {/* Rating - small but visible */}
              <div className="flex items-center mt-0.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2 w-2 ${
                        i < Math.floor(business.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-[9px] text-gray-500">
                  {business.rating ? business.rating.toFixed(1) : "N/A"}
                </span>
              </div>

              {/* Distance - highlighted */}
              {distance && (
                <div className="mt-0.5 flex items-center text-[9px] font-medium text-amber-700">
                  <Navigation className="h-2 w-2 mr-0.5" />
                  {formatDistance(distance)}
                </div>
              )}

              {/* Address - smaller and less prominent */}
              <div className="text-[8px] text-gray-500 line-clamp-1 mt-0.5">
                {business.vicinity ||
                  business.formatted_address ||
                  business.address ||
                  "No address"}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // List view - make it more compact and clearer
  return (
    <div className="bg-white rounded-lg shadow border border-amber-100 hover:shadow-md transition-all">
      <Link
        href={`/business/${businessId}`}
        className="flex items-center p-1.5"
      >
        {/* Left: Image thumbnail */}
        <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0">
          {business.photos && business.photos[0] ? (
            <Image
              src={business.photos[0]}
              alt={business.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50 text-amber-400">
              <span className="text-amber-500 font-medium">
                {business.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Category indicator */}
          <div className="absolute bottom-0 right-0">
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${getCategoryColor(
                business.category
              )}`}
            ></div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0 ml-2">
          <div className="flex justify-between items-start">
            {/* Business name */}
            <h3 className="font-medium text-xs text-gray-900 truncate">
              {business.name}
            </h3>

            {/* Distance badge - highlighted */}
            {distance && (
              <div className="flex items-center text-[9px] font-medium text-amber-700 ml-1.5 flex-shrink-0">
                <Navigation className="h-2 w-2 mr-0.5" />
                {formatDistance(distance)}
              </div>
            )}
          </div>

          {/* Bottom row with rating and address */}
          <div className="flex items-center mt-0.5 justify-between">
            {/* Rating stars */}
            {business.rating > 0 && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-1.5 w-1.5 ${
                        i < Math.floor(business.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-0.5 text-[8px] text-gray-500">
                  {business.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Truncated address */}
            <div className="text-[8px] text-gray-500 truncate max-w-[120px]">
              {business.vicinity ||
                business.formatted_address ||
                business.address}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function formatWebsiteUrl(url) {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch (e) {
    return url;
  }
}
