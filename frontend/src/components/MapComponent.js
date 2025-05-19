"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import Link from "next/link";

// Component to update map view when center changes
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapComponent({
  center,
  businesses = [],
  userLocation,
  radius = 5,
}) {
  const [map, setMap] = useState(null);
  const [iconsReady, setIconsReady] = useState(false);
  const defaultIconRef = useRef(null);
  const categoryIconsRef = useRef({});

  // Initialize Leaflet icons - this must be done in useEffect because
  // we need to be in the browser environment
  useEffect(() => {
    // Fix Leaflet default icon
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    });

    // Create our default icon
    defaultIconRef.current = new L.Icon({
      iconUrl: "/images/marker-icon.png",
      iconRetinaUrl: "/images/marker-icon-2x.png",
      shadowUrl: "/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Create category icons
    const categories = [
      "restaurant",
      "retail",
      "service",
      "entertainment",
      "health",
    ];
    categories.forEach((category) => {
      try {
        categoryIconsRef.current[category] = new L.Icon({
          iconUrl: `/icons/${category}.png`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          // Fall back to default icon if this fails
        });
      } catch (error) {
        console.warn(`Icon for category ${category} not found, using default`);
        categoryIconsRef.current[category] = defaultIconRef.current;
      }
    });

    setIconsReady(true);
  }, []);

  if (!iconsReady) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeView center={center} />

      {/* User location marker */}
      <Marker position={userLocation} icon={defaultIconRef.current}>
        <Popup>Your location</Popup>
      </Marker>

      {/* Search radius circle */}
      <Circle
        center={userLocation}
        radius={radius * 1000} // Convert km to meters
        pathOptions={{ fillColor: "blue", fillOpacity: 0.1, weight: 1 }}
      />

      {/* Business markers */}
      {businesses.map((business) => (
        <Marker
          key={business._id}
          position={[
            business.location.coordinates[1],
            business.location.coordinates[0],
          ]}
          icon={
            categoryIconsRef.current[business.category] ||
            defaultIconRef.current
          }
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold">{business.name}</h3>
              <p className="text-sm">{business.category}</p>
              <div className="flex items-center justify-center my-1">
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
                <span className="ml-1 text-xs">
                  ({business.reviewCount || 0})
                </span>
              </div>
              <Link
                href={`/business/${business._id}`}
                className="block mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
