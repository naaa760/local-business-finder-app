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
  Users,
  Smartphone,
  Zap,
  Globe,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 w-full overflow-x-hidden">
      {/* Navigation Bar - Fixed width */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-50 w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 flex-shrink-0"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800 hidden sm:block">
                LocalFinder
              </span>
              <span className="text-base font-bold text-gray-800 sm:hidden">
                LF
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {!isSignedIn ? (
                <>
                  <Link
                    href="/sign-in"
                    className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  href="/map"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Open Map
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              className="text-center lg:text-left max-w-full"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              {/* Announcement Badge */}
              <motion.div
                className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                variants={fadeInUp}
              >
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">
                  I've just launched our new location recommendation feature
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
                variants={fadeInUp}
              >
                <span className="block">Turning your</span>
                <span className="block">
                  time into{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                    Finder App
                  </span>
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-full lg:max-w-lg leading-relaxed"
                variants={fadeInUp}
              >
                Find the best local businesses, restaurants, and services in
                your area with real reviews from real people.
              </motion.p>

              {/* CTA Button */}
              <motion.div variants={fadeInUp}>
                <Link
                  href="/map"
                  className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span>Explore Map</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              className="relative mt-8 lg:mt-0 max-w-full overflow-hidden"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Restaurant interior showing LocalFinder in action"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements - Hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
          <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-orange-400 rounded-full animate-bounce animation-delay-200" />
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-bounce animation-delay-400" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 sm:mb-16 max-w-full"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium mb-4"
              variants={fadeInUp}
            >
              Discover Local Gems
            </motion.div>
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
              variants={fadeInUp}
            >
              Featured Places
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-gray-600 max-w-full sm:max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Experience the best local businesses handpicked for quality and
              exceptional service
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Search,
                title: "Smart Search",
                description:
                  "Find exactly what you're looking for with our intelligent search algorithms",
                color: "from-blue-500 to-cyan-400",
              },
              {
                icon: MapPin,
                title: "Location-Based",
                description:
                  "Discover businesses and services right in your neighborhood",
                color: "from-emerald-500 to-teal-400",
              },
              {
                icon: Star,
                title: "Verified Reviews",
                description:
                  "Read authentic reviews from real customers to make informed decisions",
                color: "from-amber-500 to-yellow-400",
              },
              {
                icon: Users,
                title: "Community Driven",
                description:
                  "Join a community of locals sharing their favorite spots",
                color: "from-purple-500 to-violet-400",
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                description:
                  "Optimized for mobile devices for searching on the go",
                color: "from-pink-500 to-rose-400",
              },
              {
                icon: Heart,
                title: "Save Favorites",
                description:
                  "Keep track of your favorite places and create personal lists",
                color: "from-red-500 to-orange-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 max-w-full"
                variants={fadeInUp}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 sm:mb-6`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-amber-500 to-orange-500 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            className="text-center max-w-full"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6"
              variants={fadeInUp}
            >
              Ready to explore your neighborhood?
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-amber-100 mb-6 sm:mb-8 max-w-full sm:max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Join thousands of users who have discovered amazing local
              businesses through LocalFinder.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/map"
                className="inline-flex items-center bg-white text-amber-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span>Start Exploring</span>
                <Globe className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">LocalFinder</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-full">
                Connecting people with amazing local businesses in their
                communities.
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Features
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Business Search</li>
                <li>Interactive Maps</li>
                <li>Reviews & Ratings</li>
                <li>Mobile App</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Support
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Connect
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Twitter</li>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 LocalFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Sign In Required
            </h3>
            <p className="text-gray-600 mb-6">
              Please sign in or create an account to access the map and discover
              local businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
