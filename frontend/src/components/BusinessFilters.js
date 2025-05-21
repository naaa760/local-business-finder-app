"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Filter,
  Clock,
  Star,
  Tag,
  Heart,
  Building,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function BusinessFilters({ filters, setFilters }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Define consistent categories with beautiful icons
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "restaurant", name: "Restaurants" },
    { id: "cafe", name: "Cafes" },
    { id: "bar", name: "Bars" },
    { id: "hotel", name: "Hotels" },
    { id: "hospital", name: "Hospitals" },
    { id: "health", name: "Health & Medical" },
    { id: "shopping", name: "Shopping" },
    { id: "entertainment", name: "Entertainment" },
    { id: "attraction", name: "Attractions" },
    { id: "park", name: "Parks" },
    { id: "museum", name: "Museums" },
    { id: "grocery", name: "Grocery" },
    { id: "bakery", name: "Bakeries" },
  ];

  // Define rating options with star icons
  const ratingOptions = [
    { value: 0, label: "Any Rating" },
    { value: 3, label: "3+ Stars" },
    { value: 4, label: "4+ Stars" },
    { value: 4.5, label: "4.5+ Stars" },
  ];

  // Define distance options with distance icons
  const distanceOptions = [
    { value: 1, label: "1 km" },
    { value: 2, label: "2 km" },
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 25, label: "25 km" },
  ];

  return (
    <div className="w-full">
      {/* Mobile-friendly filter toggle */}
      <div
        className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-amber-50 md:hidden"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-amber-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </div>

      {/* Filter content - conditionally shown on mobile */}
      <div className={`${expanded ? "block" : "hidden"} md:block mt-2`}>
        {/* Category */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setFilters({ ...filters, category: category.id })
                }
                className={`text-xs py-1 px-2 rounded-md transition-colors ${
                  filters.category === category.id
                    ? "bg-amber-500 text-white"
                    : "bg-white border border-amber-200 text-gray-700 hover:bg-amber-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Rating
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilters({ ...filters, rating: option.value })}
                className={`text-xs py-1 px-2 rounded-md transition-colors ${
                  filters.rating === option.value
                    ? "bg-amber-500 text-white"
                    : "bg-white border border-amber-200 text-gray-700 hover:bg-amber-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Distance - prominently displayed */}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-amber-600" />
            Distance
          </label>
          <div className="flex flex-wrap gap-1.5">
            {distanceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilters({ ...filters, radius: option.value })}
                className={`text-xs py-1 px-2 rounded-md transition-colors ${
                  filters.radius === option.value
                    ? "bg-amber-500 text-white"
                    : "bg-white border border-amber-200 text-gray-700 hover:bg-amber-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
