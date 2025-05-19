"use client";

import Link from "next/link";

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
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No businesses found in this area.</p>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your filters or search radius.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Businesses Near You</h2>
      <div className="space-y-4">
        {businesses.map((business) => {
          // Calculate distance if user location is available
          const distance = userLocation
            ? getDistance(
                userLocation.lat,
                userLocation.lng,
                business.location.coordinates[1],
                business.location.coordinates[0]
              ).toFixed(1)
            : null;

          return (
            <div
              key={business._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{business.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {business.category}
                  </p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.round(business.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-xs text-gray-500">
                    ({business.reviewCount || 0})
                  </span>
                </div>
              </div>

              {distance && (
                <p className="text-sm text-gray-600 mt-1">{distance} km away</p>
              )}

              <p className="text-sm mt-2 line-clamp-2">
                {business.description}
              </p>

              <div className="mt-3">
                <Link
                  href={`/business/${business._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
