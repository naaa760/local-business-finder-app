"use client";

export default function BusinessFilters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-4 pb-2">
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Categories</option>
          <option value="restaurant">Restaurants</option>
          <option value="retail">Retail</option>
          <option value="service">Services</option>
          <option value="entertainment">Entertainment</option>
          <option value="health">Health & Wellness</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Minimum Rating
        </label>
        <select
          id="rating"
          value={filters.rating}
          onChange={(e) =>
            setFilters({ ...filters, rating: parseInt(e.target.value) })
          }
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="0">Any Rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="radius"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Search Radius
        </label>
        <select
          id="radius"
          value={filters.radius}
          onChange={(e) =>
            setFilters({ ...filters, radius: parseInt(e.target.value) })
          }
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="1">1 km</option>
          <option value="2">2 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="20">20 km</option>
          <option value="50">50 km</option>
        </select>
      </div>
    </div>
  );
}
