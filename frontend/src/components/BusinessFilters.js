"use client";

import { MapPin, Filter, Clock, Star, Tag } from "lucide-react";

export default function BusinessFilters({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Define consistent categories
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "restaurant", label: "Restaurants" },
    { value: "retail", label: "Retail" },
    { value: "service", label: "Services" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health & Wellness" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-amber-50 mb-4">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-amber-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-800">Filter Results</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category filter */}
        <div className="space-y-1.5">
          <label
            htmlFor="category"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <Tag className="h-4 w-4 text-amber-500 mr-1.5" />
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 text-sm bg-gray-50"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating filter */}
        <div className="space-y-1.5">
          <label
            htmlFor="minRating"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <Star className="h-4 w-4 text-amber-500 mr-1.5" />
            Minimum Rating
          </label>
          <select
            id="minRating"
            name="minRating"
            value={filters.minRating}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 text-sm bg-gray-50"
          >
            <option value="0">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        {/* Distance filter */}
        <div className="space-y-1.5">
          <label
            htmlFor="radius"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            <MapPin className="h-4 w-4 text-amber-500 mr-1.5" />
            Distance Radius
          </label>
          <select
            id="radius"
            name="radius"
            value={filters.radius}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700 text-sm bg-gray-50"
          >
            <option value="1">1 km</option>
            <option value="2">2 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
            <option value="50">50 km</option>
          </select>
          <div className="mt-1 text-xs text-amber-600 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Search in larger areas may take longer
          </div>
        </div>
      </div>

      {/* Additional filters - could be expandable */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Show more filters
        </button>
      </div>
    </div>
  );
}
