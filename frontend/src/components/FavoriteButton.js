import React from "react";
import { Heart } from "lucide-react";

export default function FavoriteButton({ businessId }) {
  // Remove any state and effects that make API calls
  // Replace with dummy functionality

  return (
    <button
      className="text-gray-400 hover:text-gray-500"
      aria-label="Like"
      // Remove actual toggle functionality if it exists
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // Don't make API calls
      }}
    >
      <Heart className="h-5 w-5" />
    </button>
  );
}
