"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import {
  MapPin,
  Search,
  Star,
  ArrowRight,
  ArrowUpRight,
  Filter,
  Building,
  Heart,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 5;
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  // Handler for protected navigation
  const handleProtectedNavigation = (e, path) => {
    e.preventDefault();

    if (isSignedIn) {
      // User is logged in, proceed to the requested page
      router.push(path);
    } else {
      // User is not logged in, show auth modal
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 overflow-x-hidden relative">
      {/* Fixed background slideshow */}
      <div className="fixed inset-0 w-full h-full z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image})`,
              opacity: index === currentImageIndex ? 0.8 : 0,
            }}
          />
        ))}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/10 to-amber-950/40" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/15 backdrop-blur-md rounded-full border border-white/30 px-4 sm:px-6 py-3 sm:py-3 flex items-center justify-between w-full max-w-lg mx-auto">
                <div className="flex items-center gap-1.5">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-1 rounded-lg">
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                  <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
                    LocalFinder
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <Link
                    href="/about"
                    className="px-2 py-0.5 rounded-full text-white hover:bg-white/10 transition-colors text-xs"
                  >
                    About
                  </Link>

                  {isSignedIn ? (
                    <div>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <SignInButton mode="modal">
                        <button className="px-2 py-0.5 rounded-full text-xs text-white hover:bg-white/10 transition-colors">
                          Sign in
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs transition-colors">
                          Get Started
                        </button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            {/* Announcement banner */}
            <div className="bg-white/15 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 mb-8 sm:mb-12 flex items-center justify-center space-x-2 border border-white/30 w-fit mx-auto">
              <div className="bg-amber-500 rounded-full p-0.5">
                <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
              </div>
              <span className="text-xs text-white text-center">
                I&apos;ve just launched our new location recommendation feature
              </span>
            </div>

            {/* Hero section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 text-white px-4">
                <span className="bg-gradient-to-r from-[#f5f5dc] to-[#5c4033] bg-clip-text text-transparent">
                  Turning your time into{" "}
                </span>
                <span className="bg-gradient-to-r from-orange-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                  Finder App
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 sm:mb-10 px-6 leading-relaxed">
                Find the best local businesses, restaurants, and services in
                your area with real reviews from real people.
              </p>
              <div className="flex flex-col items-center justify-center px-6">
                <button
                  onClick={(e) => handleProtectedNavigation(e, "/map")}
                  className="px-8 sm:px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors shadow-lg hover:shadow-xl w-full max-w-sm sm:w-auto text-lg font-medium"
                >
                  Explore Map
                </button>
              </div>
            </motion.div>

            {/* Spacer - Reduced on mobile */}
            <div className="py-12 sm:py-16 lg:py-32" />
          </div>
        </main>

        {/* Featured places section */}
        <section className="py-12 sm:py-16 lg:py-24 relative bg-white/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 font-medium text-sm mb-3">
                Discover Local Gems
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                Featured Places<span className="text-amber-500">.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-600 mx-auto px-4">
                Experience the best local businesses handpicked for quality and
                exceptional service
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {featuredPlaces.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  viewport={{ once: true }}
                  className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100"
                >
                  <div className="h-48 overflow-hidden relative">
                    <Image
                      src={place.image}
                      alt={place.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <div className="flex justify-between items-center">
                        <span className="bg-amber-500/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                          Most Popular
                        </span>
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-medium">
                            {place.rating} ({place.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {place.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {place.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <Link href={`/business/${place.id}`}>
                        <span className="inline-flex items-center text-amber-600 font-medium hover:text-amber-700 text-sm">
                          View Details
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </span>
                      </Link>
                      <button className="p-2 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:shadow-lg transition duration-300 font-medium inline-flex items-center"
                onClick={(e) => handleProtectedNavigation(e, "/map")}
              >
                Explore All Places
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-12 sm:py-16 lg:py-24 relative bg-gradient-to-b from-white to-amber-50/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 font-medium text-sm mb-3">
                Simple Process
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                How LocalFinder Works<span className="text-amber-500">.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-600 mx-auto px-4">
                Find, discover, and connect with local businesses in just three
                simple steps
              </p>
            </div>

            {/* Map image - Hidden on mobile, smaller on tablet */}
            <div className="hidden sm:flex justify-end mb-8">
              <div className="transform rotate-3">
                <Image
                  src="/map.png"
                  alt="Map"
                  width={200}
                  height={200}
                  className="max-w-[120px] sm:max-w-[160px]"
                />
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3 relative">
                {[
                  {
                    step: 1,
                    icon: <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />,
                    title: "Share Your Location",
                    description:
                      "Allow the app to use your location or search for an area you're interested in exploring",
                  },
                  {
                    step: 2,
                    icon: <Filter className="h-6 w-6 sm:h-8 sm:w-8" />,
                    title: "Apply Filters",
                    description:
                      "Filter by category, rating, or distance to find exactly what you're looking for",
                  },
                  {
                    step: 3,
                    icon: <Star className="h-6 w-6 sm:h-8 sm:w-8" />,
                    title: "Discover & Review",
                    description:
                      "Explore businesses, read reviews, and share your own experiences with the community",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-300 relative">
                      <div className="pt-4 sm:pt-6 p-4 sm:p-6 text-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg mx-auto mb-4">
                          {item.step}
                        </div>
                        <div className="rounded-xl bg-amber-100 p-3 sm:p-4 inline-flex items-center justify-center mb-4 sm:mb-6 text-amber-600">
                          {item.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {item.description}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 p-3 sm:p-4 text-center">
                        {index === 0 && (
                          <span className="text-amber-700 text-xs sm:text-sm font-medium">
                            Start Here
                          </span>
                        )}
                        {index === 2 && (
                          <span className="text-amber-700 text-xs sm:text-sm font-medium">
                            Enjoy!
                          </span>
                        )}
                        {index === 1 && (
                          <span className="text-amber-700 text-xs sm:text-sm font-medium">
                            Customize Your Search
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-12 sm:mt-16 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition duration-300 font-medium inline-flex items-center"
                onClick={(e) => handleProtectedNavigation(e, "/map")}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white/90 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-base font-semibold text-amber-600 tracking-wide uppercase">
                What People Say
              </h2>
              <h3 className="mt-2 text-2xl sm:text-3xl md:text-4xl leading-8 font-bold tracking-tight text-gray-900">
                Testimonials from Our Users
              </h3>
              <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto px-4">
                See how LocalFinder is helping people discover amazing places
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                  role: "Food Blogger",
                  content:
                    "LocalFinder has completely changed how I discover new restaurants. The filtering options are perfect, and I love how I can see ratings at a glance!",
                },
                {
                  name: "Michael Chen",
                  avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                  role: "Business Traveler",
                  content:
                    "As someone who travels frequently, this app has been a lifesaver. I can quickly find healthcare services or great restaurants no matter where I am.",
                },
                {
                  name: "Emily Rodriguez",
                  avatar: "https://randomuser.me/api/portraits/women/33.jpg",
                  role: "Shop Owner",
                  content:
                    "The business dashboard has helped me connect with so many new customers. The analytics insights are incredibly valuable for my small business.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 sm:p-6 rounded-xl shadow-soft border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="inline-block h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400 mr-1"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {testimonial.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* App preview section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-amber-50/90 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex items-center justify-between">
              <div className="md:w-1/2 mb-8 sm:mb-12 md:mb-0 pr-0 md:pr-16">
                <h2 className="text-base font-semibold text-amber-600 tracking-wide uppercase">
                  Get The App
                </h2>
                <h3 className="mt-2 text-2xl sm:text-3xl md:text-4xl leading-8 font-bold tracking-tight text-gray-900">
                  Take LocalFinder With You
                </h3>
                <p className="mt-4 text-lg sm:text-xl text-gray-500 max-w-2xl">
                  This app is to discover local businesses wherever you go.
                  Available for web for now.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.5781 12.0096C17.5781 11.0175 17.0098 10.1279 16.1328 9.66895L7.01562 4.54098C6.55664 4.28809 6.02539 4.20606 5.51758 4.30274C5.00977 4.39941 4.56055 4.6709 4.2627 5.07324C3.95508 5.48047 3.82812 5.99316 3.91211 6.49609C3.99609 6.99902 4.28125 7.44336 4.69336 7.73633L12.2109 12L4.69336 16.2637C4.28125 16.5566 3.99609 17.001 3.91211 17.5039C3.82812 18.0068 3.95508 18.5195 4.2627 18.9268C4.56055 19.3291 5.00977 19.6006 5.51758 19.6973C6.02539 19.7939 6.55664 19.7119 7.01562 19.459L16.1328 14.3311C17.0098 13.8721 17.5781 12.9824 17.5781 12.0096Z" />
                    </svg>
                    Web App
                  </button>
                </div>
              </div>

              <div className="md:w-1/2 relative flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative w-20 h-[160px] sm:w-24 sm:h-[190px] lg:w-28 lg:h-[220px] bg-gray-900 rounded-[14px] sm:rounded-[16px] lg:rounded-[18px] border-[2px] sm:border-[2px] lg:border-[3px] border-gray-800 shadow-2xl overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-4 sm:h-6 bg-gray-800 rounded-t-lg sm:rounded-t-2xl"></div>
                  <div className="h-full w-full overflow-hidden">
                    <Image
                      src="/app-preview.jpg"
                      alt="Mobile App Preview"
                      width={320}
                      height={650}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-0.5 sm:h-1 bg-gray-700 rounded-full"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Sign In Required
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Please sign in or create an account to access the map and discover
              local businesses.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 mt-6">
              <SignInButton mode="modal">
                <button className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Create Account
                </button>
              </SignUpButton>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
