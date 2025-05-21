"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function MapSearchBar({
  onLocationSelect,
  placeholder,
  className,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      // Using OpenStreetMap Nominatim for geocoding (free and open-source)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log("Found location:", { lat, lon });
        onLocationSelect({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        console.log("Location not found");
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching for location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Got current location:", { latitude, longitude });
          onLocationSelect({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert(
            "Could not get your current location. Please allow location access or try searching instead."
          );
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className={className || "w-full"}>
      <form onSubmit={handleSearch} className="relative flex">
        <input
          type="text"
          placeholder={placeholder || "Search for a location..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 px-4 pr-10 py-2 rounded-l-full border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-r-full px-4 flex items-center justify-center transition-colors"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGetCurrentLocation}
        className="mt-2 text-xs text-amber-600 hover:text-amber-800 flex items-center justify-center w-full"
        disabled={loading}
      >
        {loading ? "Loading..." : "Use my current location"}
      </button>
    </div>
  );
}
