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

  // Grid view (default)
  if (displayStyle === "grid") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="p-4 border border-amber-100 hover:border-amber-200 bg-white hover:bg-amber-50/50 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
      >
        <div className="flex flex-col h-full">
          {/* Business Image with gorgeous styling */}
          <div className="w-full h-36 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex-shrink-0 shadow-sm relative group mb-3">
            {business.photos && business.photos[0] ? (
              <Image
                src={business.photos[0]}
                alt={business.name}
                width={300}
                height={200}
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

            {/* Distance badge if available */}
            {distance && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                  <Navigation size={10} className="mr-1" />
                  {distance} km
                </span>
              </div>
            )}
          </div>

          {/* Business details */}
          <div className="flex-grow flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
              {business.name}
            </h3>

            {/* Rating stars */}
            {business.rating > 0 && (
              <div className="flex items-center mb-2">
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
            <div className="flex items-center mt-auto text-sm text-gray-600">
              <MapPin size={14} className="mr-1 text-amber-500 flex-shrink-0" />
              <span className="line-clamp-1">
                {business.vicinity ||
                  business.formatted_address ||
                  business.address}
              </span>
            </div>

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

  // List view
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="p-3 hover:bg-amber-50/60 transition-colors duration-300 border-b border-amber-50 last:border-b-0"
    >
      <div className="flex gap-4">
        {/* Business thumbnail */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex-shrink-0 shadow-sm relative">
          {business.photos && business.photos[0] ? (
            <Image
              src={business.photos[0]}
              alt={business.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50 text-amber-400">
              <MapPin size={20} />
            </div>
          )}

          {/* Category indicator dot */}
          <div
            className={`absolute bottom-1 right-1 w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(
              business.category
            )}`}
          ></div>
        </div>

        {/* Business details */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-medium text-gray-800 line-clamp-1">
              {business.name}
            </h3>

            {distance && (
              <span className="inline-flex items-center text-xs text-gray-500 whitespace-nowrap ml-2">
                <Navigation size={10} className="mr-0.5" />
                {distance} km
              </span>
            )}
          </div>

          {/* Compact rating */}
          {business.rating > 0 && (
            <div className="flex items-center text-xs text-gray-500 mt-0.5">
              <Star size={12} className="text-amber-400 fill-amber-400 mr-1" />
              <span>
                {business.rating.toFixed(1)} ·{" "}
                {business.user_ratings_total || business.reviewCount || 0}{" "}
                reviews
              </span>
            </div>
          )}

          {/* Address */}
          <div className="text-xs text-gray-600 mt-1 line-clamp-1">
            {business.vicinity ||
              business.formatted_address ||
              business.address}
          </div>

          {/* Action button */}
          <div className="mt-1.5 flex justify-between items-center">
            <Link
              href={`/business/${businessId}`}
              className="text-xs font-medium text-amber-600 hover:text-amber-700 inline-flex items-center"
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <button className="text-gray-400 hover:text-amber-500">
              <Heart size={14} />
            </button>
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
