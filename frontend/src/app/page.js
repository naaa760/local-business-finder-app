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
  Sparkles,
  Globe,
  Users,
  TrendingUp,
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

  // Floating elements animation variants
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 overflow-x-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-rose-300/30 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Fixed background slideshow */}
      <div className="fixed inset-0 w-full h-full z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image})`,
              opacity: index === currentImageIndex ? 0.4 : 0,
            }}
          />
        ))}
        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-amber-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen">
        {/* Enhanced Header */}
        <header className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 px-6 sm:px-8 py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-2 rounded-xl shadow-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                    LocalFinder
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href="/about"
                    className="px-4 py-2 rounded-xl text-gray-700 hover:bg-white/20 transition-all duration-300 text-sm font-medium"
                  >
                    About
                  </Link>

                  {isSignedIn ? (
                    <div>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SignInButton mode="modal">
                        <button className="px-4 py-2 rounded-xl text-sm text-gray-700 hover:bg-white/20 transition-all duration-300 font-medium">
                          Sign in
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm transition-all duration-300 font-medium shadow-lg">
                          Get Started
                        </button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <main className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            {/* Floating announcement banner */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-xl rounded-2xl px-6 py-3 mb-8 sm:mb-12 flex items-center justify-center space-x-3 border border-amber-200/50 w-fit mx-auto shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-1.5"
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
                <span className="text-sm font-medium bg-gradient-to-r from-amber-700 to-orange-700 text-transparent bg-clip-text">
                  ✨ Discover amazing local businesses near you
                </span>
              </div>
            </motion.div>

            {/* Enhanced Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-16 sm:mb-20"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 px-4">
                <span className="block mb-2">
                  <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                    Discover Local
                  </span>
                </span>
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Treasures
                </span>
                <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent">
                  Around You
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-10 px-6 leading-relaxed"
              >
                Connect with amazing local businesses, read authentic reviews,
                and
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold">
                  {" "}
                  explore hidden gems
                </span>{" "}
                in your neighborhood
              </motion.p>

              {/* Enhanced CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6 mb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleProtectedNavigation(e, "/map")}
                  className="group px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto text-lg font-medium relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Explore Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              >
                {[
                  {
                    icon: <Building className="h-6 w-6" />,
                    number: "1000+",
                    label: "Businesses",
                  },
                  {
                    icon: <Users className="h-6 w-6" />,
                    number: "50K+",
                    label: "Users",
                  },
                  {
                    icon: <Star className="h-6 w-6" />,
                    number: "25K+",
                    label: "Reviews",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="text-center p-4 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg"
                  >
                    <div className="text-amber-600 mb-2 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Enhanced Featured Places Section */}
        <section className="py-16 sm:py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-amber-50/50 backdrop-blur-sm" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-medium text-sm mb-4 border border-amber-200">
                ✨ Handpicked Selection
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                Featured Local
                <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Gems
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mx-auto px-4 max-w-3xl">
                Discover exceptional local businesses that our community loves
                most
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredPlaces.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  viewport={{ once: true }}
                  className="group bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50"
                >
                  <div className="h-56 overflow-hidden relative">
                    <Image
                      src={place.image}
                      alt={place.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
                        ⭐ Featured
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium">
                          {place.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                      {place.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {place.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <Link href={`/business/${place.id}`}>
                        <motion.span
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center text-amber-600 font-medium hover:text-amber-700 text-sm"
                        >
                          Explore
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </motion.span>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-200"
                      >
                        <Heart className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-medium inline-flex items-center"
                onClick={(e) => handleProtectedNavigation(e, "/map")}
              >
                View All Places
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Enhanced How it works section */}
        <section className="py-16 sm:py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-white/80 to-amber-50/50 backdrop-blur-sm" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 font-medium text-sm mb-4 border border-indigo-200">
                🚀 Simple Process
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                How LocalFinder
                <span className="block bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
                  Works
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mx-auto px-4 max-w-3xl">
                Discover amazing local businesses in just three simple steps
              </p>
            </motion.div>

            <div className="relative">
              <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3 relative">
                {[
                  {
                    step: 1,
                    icon: <MapPin className="h-8 w-8" />,
                    title: "Share Your Location",
                    description:
                      "Allow the app to use your location or search for an area you're interested in exploring",
                    gradient: "from-blue-500 to-indigo-600",
                    bgGradient: "from-blue-50 to-indigo-50",
                    borderColor: "border-blue-200",
                  },
                  {
                    step: 2,
                    icon: <Filter className="h-8 w-8" />,
                    title: "Apply Smart Filters",
                    description:
                      "Use our intelligent filtering system to find exactly what you're looking for with precision",
                    gradient: "from-amber-500 to-orange-600",
                    bgGradient: "from-amber-50 to-orange-50",
                    borderColor: "border-amber-200",
                  },
                  {
                    step: 3,
                    icon: <Star className="h-8 w-8" />,
                    title: "Discover & Connect",
                    description:
                      "Explore amazing businesses, read authentic reviews, and share your own experiences",
                    gradient: "from-emerald-500 to-teal-600",
                    bgGradient: "from-emerald-50 to-teal-50",
                    borderColor: "border-emerald-200",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.3 },
                    }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Connecting line */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-y-1/2 z-10">
                        <motion.div
                          className="w-full h-full bg-gradient-to-r from-amber-400 to-orange-500"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 1, delay: index * 0.3 + 0.5 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    )}

                    <div
                      className={`bg-gradient-to-br ${item.bgGradient} backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border ${item.borderColor} relative overflow-hidden`}
                    >
                      {/* Floating decoration */}
                      <motion.div
                        className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-white/40 to-white/10 rounded-full blur-xl"
                        animate={floatingVariants.animate}
                        transition={{ delay: index * 0.5 }}
                      />

                      <div className="p-8 text-center relative z-10">
                        {/* Step number */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-xl mx-auto mb-6 relative`}
                        >
                          {item.step}
                          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>

                        {/* Icon */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`rounded-2xl bg-gradient-to-br ${item.bgGradient} p-4 inline-flex items-center justify-center mb-6 text-gray-700 border ${item.borderColor} shadow-lg`}
                        >
                          {item.icon}
                        </motion.div>

                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom accent */}
                      <div
                        className={`bg-gradient-to-r ${item.gradient} p-4 text-center`}
                      >
                        <span className="text-white text-sm font-medium">
                          {index === 0 && "🎯 Start Here"}
                          {index === 1 && "⚡ Customize"}
                          {index === 2 && "🌟 Explore!"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-medium inline-flex items-center relative overflow-hidden"
                onClick={(e) => handleProtectedNavigation(e, "/map")}
              >
                <span className="relative z-10 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Get Started Now
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Testimonials section */}
        <section className="py-16 sm:py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white/90 to-gray-50/80 backdrop-blur-sm" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium text-sm mb-4 border border-purple-200">
                💬 What People Say
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                Loved by
                <span className="block bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Our Community
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mx-auto px-4 max-w-3xl">
                See how LocalFinder is helping people discover amazing places
                and grow their businesses
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                  role: "Food Blogger",
                  content:
                    "LocalFinder has completely changed how I discover new restaurants. The filtering options are perfect, and I love how I can see ratings at a glance!",
                  gradient: "from-rose-50 to-pink-50",
                  accent: "from-rose-400 to-pink-500",
                },
                {
                  name: "Michael Chen",
                  avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                  role: "Business Traveler",
                  content:
                    "As someone who travels frequently, this app has been a lifesaver. I can quickly find healthcare services or great restaurants no matter where I am.",
                  gradient: "from-blue-50 to-indigo-50",
                  accent: "from-blue-400 to-indigo-500",
                },
                {
                  name: "Emily Rodriguez",
                  avatar: "https://randomuser.me/api/portraits/women/33.jpg",
                  role: "Shop Owner",
                  content:
                    "The business dashboard has helped me connect with so many new customers. The analytics insights are incredibly valuable for my small business.",
                  gradient: "from-emerald-50 to-teal-50",
                  accent: "from-emerald-400 to-teal-500",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  viewport={{ once: true }}
                  className={`bg-gradient-to-br ${testimonial.gradient} backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 transition-all duration-500 relative overflow-hidden`}
                >
                  {/* Floating accent */}
                  <motion.div
                    className={`absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br ${testimonial.accent} opacity-10 rounded-full blur-2xl`}
                    animate={floatingVariants.animate}
                    transition={{ delay: index * 0.3 }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="h-14 w-14 rounded-2xl overflow-hidden mr-4 shadow-lg border-2 border-white"
                      >
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.2 + i * 0.1,
                          }}
                          viewport={{ once: true }}
                        >
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400 mr-1" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-gray-700 text-base leading-relaxed italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-3xl hover:shadow-2xl transition-all duration-300 font-bold text-xl inline-flex items-center relative overflow-hidden"
                onClick={(e) => handleProtectedNavigation(e, "/map")}
              >
                <span className="relative z-10 flex items-center">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Start Your Local Adventure
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Enhanced Authentication Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/50 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-xl" />

            <div className="relative z-10">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <MapPin className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to LocalFinder
                </h3>
                <p className="text-gray-600 text-sm">
                  Sign in to discover amazing local businesses and connect with
                  your community
                </p>
              </div>

              <div className="space-y-3">
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg"
                  >
                    Sign In
                  </motion.button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 border-2 border-gray-200 bg-white/50 text-gray-700 rounded-2xl hover:bg-white/80 hover:border-gray-300 transition-all duration-300 font-medium"
                  >
                    Create Account
                  </motion.button>
                </SignUpButton>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowAuthModal(false)}
                className="mt-6 text-gray-500 hover:text-gray-700 text-sm w-full py-2 transition-colors"
              >
                Maybe later
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
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
