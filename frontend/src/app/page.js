"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { MapPin, Search, Star, ArrowRight, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 5;

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Slideshow effect for background images
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Array of background images
  const backgroundImages = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
  ];

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background slideshow */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
            opacity: index === currentImageIndex ? 1.3 : 0,
            zIndex: index === currentImageIndex ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-[2]" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/20 to-amber-950/60 z-[3]" />

      {/* Background decorations */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-amber-200/30 to-transparent rounded-full -mr-48 -mt-48 blur-3xl z-[4]"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${
            mousePosition.y * 0.01
          }px)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-amber-300/20 to-transparent rounded-full -ml-48 -mb-48 blur-3xl z-[4]"
        style={{
          transform: `translate(${mousePosition.x * -0.01}px, ${
            mousePosition.y * -0.01
          }px)`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-2 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
                LocalFinder
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/about"
                className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                About
              </Link>
              <Link
                href="/features"
                className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/support"
                className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                Support
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="px-4 py-2 rounded-full text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    My Profile
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 rounded-full text-sm text-white hover:bg-white/10 transition-colors">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-sm transition-colors">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Announcement banner */}
          <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 flex items-center justify-center space-x-2 border border-white/20 max-w-2xl mx-auto">
            <div className="bg-amber-500 rounded-full p-1">
              <Star className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm text-white">
              We&apos;ve just launched our new location recommendation feature
            </span>
            <Link
              href="/features"
              className="text-amber-300 hover:text-amber-200 text-sm flex items-center"
            >
              Learn more <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Discover Places Around{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Your World
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Find the best local businesses, restaurants, and services in your
              area with real reviews from real people.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/map")}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Explore Map
              </button>
              <button
                onClick={() => router.push("/business-dashboard")}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full transition-colors w-full sm:w-auto"
              >
                For Business Owners
              </button>
            </div>
          </motion.div>

          {/* Featured places */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Featured Local Favorites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="h-40 relative">
                    <Image
                      src={place.image}
                      alt={place.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {place.title}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(place.rating)
                                ? "fill-amber-400"
                                : "fill-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-amber-300 text-sm ml-2">
                        {place.rating} ({place.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mb-4">
                      {place.description}
                    </p>
                    <Link
                      href={`/business/${place.id}`}
                      className="text-amber-300 hover:text-amber-200 font-medium text-sm flex items-center"
                    >
                      View details <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/map"
                className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                Discover more places <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md border-t border-white/10 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-1.5 rounded-lg">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-amber-300 to-amber-500 text-transparent bg-clip-text">
                LocalFinder
              </span>
            </div>
            <div className="flex gap-6">
              <Link
                href="/about"
                className="text-white/70 hover:text-white text-sm"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-white/70 hover:text-white text-sm"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-white/70 hover:text-white text-sm"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-white/70 hover:text-white text-sm"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-white/50">
            © {new Date().getFullYear()} LocalFinder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Example featured places data
const featuredPlaces = [
  {
    id: "1",
    title: "Coastal Coffee House",
    image: "/images/cafe.jpg",
    rating: 4.5,
    reviews: 128,
    description:
      "A cozy café with freshly roasted coffee and homemade pastries.",
  },
  {
    id: "2",
    title: "Urban Bistro",
    image: "/images/restaurant.jpg",
    rating: 4.8,
    reviews: 203,
    description:
      "Fine dining restaurant featuring locally sourced ingredients.",
  },
  {
    id: "3",
    title: "Wellness Retreat Spa",
    image: "/images/spa.jpg",
    rating: 5,
    reviews: 87,
    description: "Luxury spa services for relaxation and rejuvenation.",
  },
];
