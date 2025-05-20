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
  return (R * c).toFixed(1); // Distance in km
}

export default function BusinessCard({ business, userLocation }) {
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

  // Determine category color
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-4 border-b border-white/10 hover:bg-white/10 transition-all duration-300 rounded-xl"
    >
      <div className="flex gap-4">
        {/* Business Image with gorgeous styling */}
        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex-shrink-0 shadow-lg relative group">
          {business.photos && business.photos[0] ? (
            <Image
              src={business.photos[0]}
              alt={business.name}
              width={112}
              height={112}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50 text-amber-400">
              <MapPin size={28} className="drop-shadow-md" />
            </div>
          )}

          {/* Category badge */}
          <div
            className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(
              business.category
            )} shadow-md`}
          >
            {business.category || "Place"}
          </div>
        </div>

        {/* Business Info with enhanced typography and layout */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1 text-lg">
            {business.name}
          </h3>

          {/* Rating with animated stars */}
          {business.rating && (
            <div className="flex items-center mt-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Star
                      size={16}
                      className={`${
                        i < Math.floor(business.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {business.rating.toFixed(1)} (
                {business.user_ratings_total || business.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Address with icon */}
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <MapPin size={14} className="mr-1 text-amber-500" />
            <span className="line-clamp-1">
              {business.vicinity ||
                business.formatted_address ||
                business.address}
            </span>
          </div>

          {/* Distance with elegant badge */}
          {distance && (
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <Navigation size={12} className="mr-1" />
                {distance} km away
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-3 flex space-x-2">
            <Link href={`/business/${businessId}`} className="flex-1">
              <Button
                variant="default"
                className="w-full h-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md"
              >
                View Details
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full border-amber-200 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
            >
              <Heart size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
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
