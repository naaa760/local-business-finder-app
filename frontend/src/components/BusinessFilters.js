"use client";

import React from "react";
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
} from "lucide-react";

export default function BusinessFilters({ filters, setFilters }) {
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

  // Distance options with labels
  const distanceOptions = [
    { value: 1, label: "1 km" },
    { value: 2, label: "2 km" },
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 20, label: "20 km" },
  ];

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
  };

  const handleRatingChange = (e) => {
    setFilters({ ...filters, rating: parseFloat(e.target.value) });
  };

  const handleDistanceChange = (e) => {
    setFilters({ ...filters, radius: parseInt(e.target.value) });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "all",
      rating: 0,
      radius: 5,
    });
  };

  return (
    <div className="py-2">
      {/* Filter section heading */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm text-gray-700 flex items-center">
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          Filter Results
        </h3>
        <button
          onClick={clearFilters}
          className="text-xs text-amber-600 hover:text-amber-700"
        >
          Clear All
        </button>
      </div>

      {/* Categories - scrollable grid */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Category
        </label>
        <div className="max-h-24 overflow-y-auto pb-1 pr-1 grid grid-cols-2 gap-1.5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
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

      {/* Minimum Rating */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Minimum Rating
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

      {/* Distance */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
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
  );
}
