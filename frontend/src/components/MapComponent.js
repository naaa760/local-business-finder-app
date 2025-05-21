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
  ZoomControl,
  LayersControl,
} from "react-leaflet";
import Link from "next/link";
import { Star, Navigation, Phone, Globe, MapPin, Compass } from "lucide-react";
import { motion } from "framer-motion";

// Component to update map view when center changes
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    // Only call setView if center is defined and has lat/lng properties
    if (center && center.lat !== undefined && center.lng !== undefined) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
}

// Custom Map Styling
const MapStyle = () => {
  const map = useMap();

  useEffect(() => {
    // Apply custom styles to the map
    map.getContainer().style.borderRadius = "1.5rem";
    map.getContainer().style.boxShadow =
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    map.getContainer().style.border = "1px solid rgba(255, 255, 255, 0.2)";

    // Add a subtle animation when the map loads
    map.getContainer().style.transition = "all 0.3s ease-in-out";
    map.getContainer().style.opacity = "0";
    setTimeout(() => {
      map.getContainer().style.opacity = "1";
    }, 100);

    // Custom map controls styling
    const controls = document.querySelectorAll(
      ".leaflet-control-container .leaflet-control"
    );
    controls.forEach((control) => {
      control.style.borderRadius = "0.75rem";
      control.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    });

    // Add a nice pulse animation when the map finishes loading
    map.on("load", () => {
      const container = map.getContainer();
      container.classList.add("map-loaded");
    });
  }, [map]);

  return null;
};

// Map attribution component with cleaner styling
const MapAttribution = () => {
  const map = useMap();

  useEffect(() => {
    const attributionControl = document.querySelector(
      ".leaflet-control-attribution"
    );
    if (attributionControl) {
      attributionControl.style.background = "rgba(255, 255, 255, 0.7)";
      attributionControl.style.backdropFilter = "blur(4px)";
      attributionControl.style.padding = "4px 8px";
      attributionControl.style.borderRadius = "8px";
      attributionControl.style.margin = "0 10px 10px 0";
      attributionControl.style.fontSize = "10px";
      attributionControl.style.color = "#6B7280";
    }
  }, [map]);

  return null;
};

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
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [mapStyle, setMapStyle] = useState("light");

  // Different map styles for user to choose from
  const mapStyles = {
    light: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    dark: {
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=4fbd37fe-f756-4a1b-b1ad-62398d8bfeae",
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
    outdoor: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    },
    colorful: {
      url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      attribution:
        '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  };

  // Initialize Leaflet icons with beautiful designs
  useEffect(() => {
    // User location marker icon with animated pulse effect
    defaultIconRef.current = L.divIcon({
      html: `
        <div class="relative">
          <div class="absolute -inset-2 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
          <div class="absolute -inset-1 rounded-full bg-blue-400 opacity-30"></div>
          <div class="relative flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-lg">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      `,
      className: "custom-div-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Create beautiful category icons with gradients and effects
    const categories = [
      "restaurant",
      "retail",
      "service",
      "entertainment",
      "health",
    ];

    const categoryColors = {
      restaurant: ["#ef4444", "#f97316"], // Red to orange gradient
      retail: ["#3b82f6", "#06b6d4"], // Blue to cyan gradient
      service: ["#10b981", "#34d399"], // Green gradient
      entertainment: ["#8b5cf6", "#a855f7"], // Purple gradient
      health: ["#14b8a6", "#2dd4bf"], // Teal gradient
      default: ["#f59e0b", "#fbbf24"], // Amber gradient
    };

    const categoryIcons = {
      restaurant:
        '<path d="M7 2v11h2v9h2V13h2V2H7zm12 0h-2v19h2v-7h2.1c1.9 0 3.9-1.6 3.9-4.2V6.2C25 3.6 23 2 21.1 2H19z"></path>',
      retail:
        '<path d="M12 5c1.1 0 2 .9 2 2H6.5l1.7-1.7c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L6.8 9.5c-.4.4-1 .4-1.4 0L2.6 6.7c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L5.7 7H10V5H7c0-1.7 1.3-3 3-3s3 1.3 3 3zm-3 14c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"></path>',
      service:
        '<path d="M21.7,18.6V16.6c0-0.9-0.7-1.6-1.6-1.6h-2.8v-2.2c1.1-0.2,1.9-1.2,1.9-2.3c0-1.3-1.1-2.4-2.4-2.4c-1.3,0-2.4,1.1-2.4,2.4c0,1.2,0.9,2.2,2,2.3v2.2h-3.2v-2.2c1.1-0.2,1.9-1.2,1.9-2.3c0-1.3-1.1-2.4-2.4-2.4c-1.3,0-2.4,1.1-2.4,2.4c0,1.2,0.9,2.2,2,2.3v2.2H8.1c-0.9,0-1.6,0.7-1.6,1.6v1.9c-1.2,0.1-2.1,1.1-2.1,2.3c0,1.3,1.1,2.4,2.4,2.4c1.3,0,2.4-1.1,2.4-2.4c0-1.2-0.9-2.2-2-2.3v-1.9h3.3v1.9c-1.1,0.1-2,1.1-2,2.3c0,1.3,1.1,2.4,2.4,2.4c1.3,0,2.4-1.1,2.4-2.4c0-1.2-0.9-2.2-2-2.3v-1.9h3.3v1.9c-1.1,0.1-2,1.1-2,2.3c0,1.3,1.1,2.4,2.4,2.4c1.3,0,2.4-1.1,2.4-2.4C23.8,19.7,22.9,18.7,21.7,18.6z"></path>',
      entertainment:
        '<path d="M16.9 10.9c-0.3-0.8-1-1.5-1.9-1.7l-6-1.5c-0.9-0.2-1.9 0-2.6 0.6C5.7 9 5.3 10 5.5 11l1.5 6c0.2 0.9 0.9 1.6 1.7 1.9 0.3 0.1 0.7 0.2 1 0.2 0.6 0 1.1-0.2 1.6-0.5l6-4.5c0.7-0.5 1.1-1.4 1.1-2.2 -0.1-0.8-0.5-1.5-1.2-2.1 -0.3-0.2-0.5-0.3-0.9-0.3zm-7.9 8.9c-0.5 0.3-1.2 0.2-1.6-0.2s-0.5-1.1-0.2-1.6l3.6-5.7c0.3-0.5 1-0.6 1.5-0.3 0.5 0.3 0.6 1 0.3 1.5l-3.6 5.7 -0.2 0.3c-0.2 0.4-0.5 0.5-0.9 0.5l-0.2 0c-0.1 0-0.2-0.1-0.3-0.1l-0.4-0.1 0.3 0.1C8.8 19.1 8.6 19 8.5 19l-0.8-0.5 1.2 0.4H9z"></path>',
      health:
        '<path d="M19.2 5H4.8C3.4 5 2.1 6.1 2.1 7.5V16.5c0 1.4 1.3 2.5 2.7 2.5H19.3c1.4 0 2.7-1.1 2.7-2.5V7.5C21.9 6.1 20.6 5 19.2 5zM12.5 17h-1v-3.6H8.3v-1h3.2V8.7h1v3.7h3.2v1h-3.2V17z"></path>',
    };

    categories.forEach((category) => {
      try {
        const colors = categoryColors[category] || categoryColors.default;
        const icon = categoryIcons[category] || "";

        categoryIconsRef.current[category] = L.divIcon({
          html: `
            <div class="relative group">
              <div class="absolute -inset-1 rounded-full opacity-25 bg-gradient-to-r from-white to-white blur-sm group-hover:opacity-40 transition-opacity duration-200"></div>
              <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-${colors[0]} to-${colors[1]} shadow-lg border border-white transform transition-all duration-200 hover:scale-110 hover:shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 fill-white">
                  ${icon}
                </svg>
              </div>
            </div>
          `,
          className: "business-marker-icon",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });
      } catch (err) {
        console.error(`Error creating icon for ${category}:`, err);
        // Fallback to default
        const colors = categoryColors.default;
        categoryIconsRef.current[category] = L.divIcon({
          html: `
            <div class="relative group">
              <div class="absolute -inset-1 rounded-full opacity-25 bg-white blur-sm group-hover:opacity-40 transition-opacity duration-200"></div>
              <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-${colors[0]} to-${colors[1]} shadow-lg border border-white transform transition-all duration-200 hover:scale-110">
                <div class="w-4 h-4 bg-white/80 rounded-sm"></div>
              </div>
            </div>
          `,
          className: "business-marker-icon",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });
      }
    });

    setIconsReady(true);
  }, []);

  // Handler for map click to clear selected business
  const handleMapClick = () => {
    setSelectedBusiness(null);
  };

  // Provide a default center if userLocation is undefined
  const mapCenter =
    userLocation && userLocation.lat
      ? userLocation
      : { lat: 40.7128, lng: -74.006 }; // Default to NYC

  if (!iconsReady) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-amber-50 to-amber-100/50 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-amber-500 flex items-center gap-2">
          <Compass className="h-6 w-6 animate-spin" />
          <span className="font-medium">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Map style selector */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-lg border border-white/20 flex">
        <button
          onClick={() => setMapStyle("light")}
          className={`p-2 text-xs rounded-md ${
            mapStyle === "light"
              ? "bg-amber-100 text-amber-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setMapStyle("dark")}
          className={`p-2 text-xs rounded-md ${
            mapStyle === "dark"
              ? "bg-amber-100 text-amber-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Dark
        </button>
        <button
          onClick={() => setMapStyle("satellite")}
          className={`p-2 text-xs rounded-md ${
            mapStyle === "satellite"
              ? "bg-amber-100 text-amber-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setMapStyle("outdoor")}
          className={`p-2 text-xs rounded-md ${
            mapStyle === "outdoor"
              ? "bg-amber-100 text-amber-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Outdoor
        </button>
        <button
          onClick={() => setMapStyle("colorful")}
          className={`p-2 text-xs rounded-md ${
            mapStyle === "colorful"
              ? "bg-amber-100 text-amber-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Colorful
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        whenCreated={setMap}
        zoomControl={false}
        attributionControl={false}
        className="z-10 map-container"
        onClick={handleMapClick}
      >
        <TileLayer
          url={mapStyles[mapStyle].url}
          attribution={mapStyles[mapStyle].attribution}
        />
        <ZoomControl position="bottomright" />
        <MapStyle />
        <MapAttribution />
        {userLocation && userLocation.lat && (
          <ChangeView center={userLocation} />
        )}

        {/* User location marker with pulse effect */}
        <Marker position={userLocation} icon={defaultIconRef.current}>
          <Popup className="custom-popup">
            <div className="p-3 text-center">
              <div className="font-semibold text-blue-600 mb-1">
                Your Location
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <MapPin size={12} className="text-blue-400" />
                {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Search radius circle with beautiful styling */}
        <Circle
          center={userLocation}
          radius={radius * 1000} // Convert km to meters
          pathOptions={{
            fillColor: "rgba(59, 130, 246, 0.05)",
            fillOpacity: 0.1,
            color: "#3b82f6",
            weight: 2,
            opacity: 0.3,
            dashArray: "5, 10",
          }}
        />

        {/* Business markers with enhanced popups */}
        {businesses.map((business) => (
          <Marker
            key={business._id}
            position={[
              business.location.coordinates[1],
              business.location.coordinates[0],
            ]}
            icon={
              categoryIconsRef.current[business.category] ||
              categoryIconsRef.current.default
            }
            eventHandlers={{
              click: () => setSelectedBusiness(business),
            }}
          >
            <Popup className="custom-popup">
              <div className="min-w-[280px] overflow-hidden">
                {/* Business image header */}
                {business.photos && business.photos[0] ? (
                  <div className="h-32 w-full relative overflow-hidden">
                    <img
                      src={business.photos[0]}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      {business.category}
                    </div>
                  </div>
                ) : null}

                <div className="p-3">
                  <div className="font-bold text-gray-800 text-lg mb-1">
                    {business.name}
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.round(business.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-600">
                      ({business.reviewCount || 0})
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin
                        size={14}
                        className="mr-1.5 flex-shrink-0 text-gray-400"
                      />
                      <span className="text-sm line-clamp-1">
                        {business.address || business.vicinity}
                      </span>
                    </div>

                    {business.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone
                          size={14}
                          className="mr-1.5 flex-shrink-0 text-gray-400"
                        />
                        <span>{business.phone}</span>
                      </div>
                    )}

                    {business.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe
                          size={14}
                          className="mr-1.5 flex-shrink-0 text-gray-400"
                        />
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 truncate max-w-[180px]"
                        >
                          {new URL(business.website).hostname}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/business/${business._id}`}
                      className="flex-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm text-center font-medium"
                    >
                      View Details
                    </Link>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${business.location.coordinates[1]},${business.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm"
                    >
                      <Navigation size={14} className="mr-1" />
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Elegant Map legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/20 max-w-xs">
        <div className="text-xs font-medium text-gray-600 mb-2">Map Legend</div>
        <div className="space-y-1.5">
          {["restaurant", "retail", "service", "entertainment", "health"].map(
            (category) => (
              <div key={category} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColorClass(
                    category
                  )}`}
                ></div>
                <span className="text-xs text-gray-700 capitalize">
                  {category}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get category color classes - add consistent categories including hospital
function getCategoryColorClass(category) {
  const colors = {
    restaurant: "from-rose-500 to-orange-500",
    retail: "from-blue-500 to-cyan-400",
    service: "from-emerald-500 to-teal-400",
    entertainment: "from-purple-500 to-violet-400",
    health: "from-teal-500 to-green-400",
    hospital: "from-red-500 to-rose-400",
  };
  return colors[category] || "from-amber-500 to-yellow-400";
}
