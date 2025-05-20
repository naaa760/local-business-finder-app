import React, { useState } from "react";
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const distance = userLocation
    ? getDistance(
        userLocation.lat,
        userLocation.lng,
        business.geometry?.location.lat || business.location?.coordinates[1],
        business.geometry?.location.lng || business.location?.coordinates[0]
      )
    : null;

  return (
    <>
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
                  {business.rating.toFixed(1)} (
                  {business.user_ratings_total || 0})
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

            {/* View Details Button */}
            <Button
              onClick={() => setShowDetailsModal(true)}
              variant="outline"
              size="sm"
              className="mt-2 text-sm rounded-full h-8 px-4 bg-white hover:bg-amber-50 border-amber-200 text-amber-800 hover:text-amber-900"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {business.name}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image Gallery */}
              {business.photos && business.photos.length > 0 && (
                <div className="mb-6 overflow-hidden rounded-xl">
                  <Image
                    src={business.photos[0]}
                    alt={business.name}
                    width={600}
                    height={300}
                    className="w-full h-[200px] object-cover"
                  />
                </div>
              )}

              {/* Rating */}
              {business.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < Math.floor(business.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {business.rating.toFixed(1)} (
                    {business.user_ratings_total || 0} reviews)
                  </span>
                </div>
              )}

              {/* Info List */}
              <div className="space-y-3 mb-6">
                {/* Address */}
                <div className="flex items-start">
                  <MapPin size={18} className="mr-2 text-gray-500 mt-0.5" />
                  <span className="text-gray-700">
                    {business.vicinity || business.formatted_address}
                  </span>
                </div>

                {/* Phone */}
                {business.formatted_phone_number && (
                  <div className="flex items-start">
                    <Phone size={18} className="mr-2 text-gray-500 mt-0.5" />
                    <span className="text-gray-700">
                      {business.formatted_phone_number}
                    </span>
                  </div>
                )}

                {/* Website */}
                {business.website && (
                  <div className="flex items-start">
                    <Globe size={18} className="mr-2 text-gray-500 mt-0.5" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formatWebsiteUrl(business.website)}
                    </a>
                  </div>
                )}

                {/* Hours */}
                {business.opening_hours && (
                  <div className="flex items-start">
                    <Clock size={18} className="mr-2 text-gray-500 mt-0.5" />
                    <div>
                      {business.opening_hours.open_now !== undefined && (
                        <div
                          className={`font-medium ${
                            business.opening_hours.open_now
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {business.opening_hours.open_now
                            ? "Open Now"
                            : "Closed Now"}
                        </div>
                      )}
                      {business.opening_hours.weekday_text && (
                        <details className="mt-1">
                          <summary className="text-sm text-blue-600 cursor-pointer">
                            Show hours
                          </summary>
                          <ul className="mt-2 text-sm text-gray-600 space-y-1">
                            {business.opening_hours.weekday_text.map(
                              (day, i) => (
                                <li key={i}>{day}</li>
                              )
                            )}
                          </ul>
                        </details>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Directions */}
                {business.geometry?.location && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${business.geometry.location.lat},${business.geometry.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full rounded-full" variant="default">
                      <Navigation size={16} className="mr-2" />
                      Get Directions
                    </Button>
                  </a>
                )}

                {/* Call */}
                {business.formatted_phone_number && (
                  <a
                    href={`tel:${business.formatted_phone_number.replace(
                      /\D/g,
                      ""
                    )}`}
                    className="flex-1"
                  >
                    <Button className="w-full rounded-full" variant="outline">
                      <Phone size={16} className="mr-2" />
                      Call
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
