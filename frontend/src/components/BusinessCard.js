import React from "react";
import { MapPin, Star, Phone, Clock } from "lucide-react";
import { Button } from "./ui/button";

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

  return (
    <div className="p-4 hover:bg-white/30 transition-all group">
      <div className="flex gap-4">
        {/* Business Image */}
        {business.photos?.[0] && (
          <img
            src={business.photos[0]}
            alt={business.name}
            className="w-24 h-24 object-cover rounded-lg shadow-sm"
          />
        )}

        {/* Business Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
                {business.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(business.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({business.user_ratings_total || business.reviewCount || 0})
                </span>
              </div>
            </div>

            {/* Distance Badge */}
            {distance && (
              <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {distance} km
              </span>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600 line-clamp-2">
              {business.vicinity || business.formatted_address}
            </p>

            {/* Status and Contact */}
            <div className="flex items-center gap-3 mt-2">
              {business.opening_hours?.open_now !== undefined && (
                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1
                  ${
                    business.opening_hours.open_now
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {business.opening_hours.open_now ? "Open Now" : "Closed"}
                </span>
              )}

              {business.phone && (
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {business.phone}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-amber-700 border-amber-200 hover:bg-amber-50"
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-amber-700"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
