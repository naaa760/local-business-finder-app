import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react"; // You may need to install lucide-react

export default function BusinessCard({ business }) {
  const { _id, name, category, rating, reviewCount, address, distance } =
    business;

  // Category colors for visual distinction
  const categoryColors = {
    restaurant: "bg-red-100 text-red-800",
    retail: "bg-blue-100 text-blue-800",
    service: "bg-green-100 text-green-800",
    entertainment: "bg-purple-100 text-purple-800",
    health: "bg-teal-100 text-teal-800",
  };

  return (
    <Link
      href={`/business/${_id}`}
      className="card block p-4 hover:cursor-pointer mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="h-20 w-20 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={`/category-images/${category}.jpg`}
            alt={category}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-subtitle mb-1 text-gray-900">{name}</h3>

          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2 py-1 rounded-full capitalize ${
                categoryColors[category] || "bg-gray-100 text-gray-800"
              }`}
            >
              {category}
            </span>

            <div className="flex items-center text-sm">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-gray-500">({reviewCount})</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2 line-clamp-1">{address}</p>

          {distance && (
            <p className="text-sm font-medium text-gray-900">
              {distance} km away
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
