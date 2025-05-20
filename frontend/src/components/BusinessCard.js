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

  // Grid view (default)
  if (displayStyle === "grid") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="p-4 border border-amber-100 hover:border-amber-200 bg-white hover:bg-amber-50/50 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md h-full"
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
            <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
              {business.name}
            </h3>

            {/* Rating */}
            {business.rating && (
              <div className="flex items-center mb-1.5">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={`${
                        star <= Math.round(business.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      } mr-0.5`}
                    />
                  ))}
                </div>
                <span className="ml-1.5 text-xs text-gray-600">
                  ({business.user_ratings_total || business.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Address with icon */}
            <div className="flex items-start mt-0.5 text-sm text-gray-600 mb-2">
              <MapPin
                size={14}
                className="mr-1 text-amber-500 mt-0.5 flex-shrink-0"
              />
              <span className="line-clamp-2 text-xs">
                {business.vicinity ||
                  business.formatted_address ||
                  business.address}
              </span>
            </div>

            {/* Spacer to push button to bottom */}
            <div className="flex-grow"></div>

            {/* Action buttons - redesigned for better layout */}
            <div className="mt-2 flex space-x-2">
              <Link href={`/business/${businessId}`} className="flex-1">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full h-7 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm text-xs font-medium rounded-lg"
                >
                  View Details
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 rounded-full border-amber-200 text-amber-500 hover:text-amber-600 hover:bg-amber-50 p-0 flex items-center justify-center"
              >
                <Heart size={14} />
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
      className="p-3 hover:bg-amber-50/50 transition-all duration-300 rounded-lg"
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
