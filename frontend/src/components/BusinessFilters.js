"use client";

import {
  MapPin,
  Filter,
  Clock,
  Star,
  Tag,
  Heart,
  Building,
} from "lucide-react";

export default function BusinessFilters({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Define consistent categories with beautiful icons
  const categories = [
    { value: "all", label: "All Categories", icon: <Building size={16} /> },
    {
      value: "restaurant",
      label: "Restaurants",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 11V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7" />
          <path d="M21 11V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v7" />
          <path d="M18 11h2" />
          <path d="M4 11h2" />
          <path d="M10 11h4" />
          <path d="M22 20v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" />
          <path d="M18 15v2" />
          <path d="M6 15v2" />
        </svg>
      ),
    },
    {
      value: "retail",
      label: "Retail",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          <path d="M2 7h20" />
          <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
        </svg>
      ),
    },
    {
      value: "service",
      label: "Services",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      value: "entertainment",
      label: "Entertainment",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      value: "health",
      label: "Health & Wellness",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
      ),
    },
    {
      value: "hospital",
      label: "Hospitals",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ];

  // Define rating options with star icons
  const ratingOptions = [
    { value: "0", label: "Any Rating" },
    { value: "3", label: "3+ Stars" },
    { value: "4", label: "4+ Stars" },
    { value: "4.5", label: "4.5+ Stars" },
  ];

  // Distance options with labels
  const distanceOptions = [
    { value: "1", label: "1 km" },
    { value: "2", label: "2 km" },
    { value: "5", label: "5 km" },
    { value: "10", label: "10 km" },
    { value: "20", label: "20 km" },
    { value: "50", label: "50 km" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-5">
      <div className="flex items-center mb-5">
        <Filter className="h-5 w-5 text-gray-800 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Filter Results</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Category filter - modernized with pills */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Tag className="h-4 w-4 text-gray-600 mr-1.5" />
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, category: category.value }))
                }
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filters.category === category.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating filter - with star visualization */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Star className="h-4 w-4 text-gray-600 mr-1.5" />
            Minimum Rating
          </label>
          <div className="flex flex-wrap gap-2">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, rating: option.value }))
                }
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filters.rating === option.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
                {option.value !== "0" && (
                  <div className="ml-1.5 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < parseInt(option.value)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Distance filter - visual radius indicator */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 text-gray-600 mr-1.5" />
            Distance Radius
          </label>
          <div className="flex flex-wrap gap-2">
            {distanceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, radius: option.value }))
                }
                className={`relative flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filters.radius === option.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <span>{option.label}</span>
                  {parseInt(option.value) > 10 && (
                    <Clock className="h-3 w-3 ml-1 text-amber-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-1 text-xs text-amber-600 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Searching larger areas may take longer
          </div>
        </div>
      </div>

      {/* Reset filters button */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={() => setFilters({ category: "all", rating: 0, radius: 5 })}
          className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset Filters
        </button>
      </div>
    </div>
  );
}
