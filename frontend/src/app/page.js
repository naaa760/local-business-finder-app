import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find Local Businesses Anywhere
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover top-rated local businesses around the world with our
            interactive map
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/map"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Explore Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
