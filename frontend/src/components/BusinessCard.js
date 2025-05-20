import React from "react";
import Link from "next/link";
import { MapPin, Star, Phone, Clock, X, Globe, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

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

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-white/40 transition-colors">
      <div className="flex gap-3">
        {/* Business Image */}
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {business.photos && business.photos[0] ? (
            <Image
              src={business.photos[0]}
              alt={business.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-300">
              <MapPin size={24} />
            </div>
          )}
        </div>

        {/* Business Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {business.name}
          </h3>

          {/* Rating */}
          {business.rating && (
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(business.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-600">
                {business.rating.toFixed(1)} ({business.user_ratings_total || 0}
                )
              </span>
            </div>
          )}

          {/* Address */}
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span className="line-clamp-1">
              {business.vicinity || business.formatted_address}
            </span>
          </div>

          {/* Distance */}
          {distance && (
            <div className="text-sm text-gray-500 mt-1">
              <span>{distance} km away</span>
            </div>
          )}

          {/* View Details Button - Link to business detail page */}
          <Link href={`/business/${businessId}`}>
            <Button
              variant="outline"
              className="mt-2 text-sm h-8 px-3 w-full justify-center"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
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
