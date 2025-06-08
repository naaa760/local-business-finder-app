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
              opacity: index === currentImageIndex ? 0.7 : 0,
            }}
          />
        ))}
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen">
        {/* Enhanced Header */}
        <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-1.5 sm:p-2 rounded-xl shadow-lg">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                    LocalFinder
                  </span>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link
                    href="/about"
                    className="hidden sm:block px-3 sm:px-4 py-2 rounded-xl text-gray-700 hover:bg-white/20 transition-all duration-300 text-sm font-medium"
                  >
                    About
                  </Link>

                  {isSignedIn ? (
                    <div className="scale-90 sm:scale-100">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <SignInButton mode="modal">
                        <button className="px-3 sm:px-4 py-2 rounded-xl text-sm text-gray-700 hover:bg-white/20 transition-all duration-300 font-medium">
                          Sign in
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm transition-all duration-300 font-medium shadow-lg">
                          <span className="hidden sm:inline">Get Started</span>
                          <span className="sm:hidden">Join</span>
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
        <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Floating announcement banner */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 sm:mb-12"
            >
              <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-xl rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 lg:mb-12 flex items-center justify-center space-x-2 sm:space-x-3 border border-amber-200/50 w-fit mx-auto shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-1 sm:p-1.5"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </motion.div>
                <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-700 to-orange-700 text-transparent bg-clip-text">
                  ✨ Discover amazing local businesses
                </span>
              </div>
            </motion.div>

            {/* Enhanced Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-12 sm:mb-16 lg:mb-20"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 px-2 sm:px-4">
                <span className="block mb-1 sm:mb-2">
                  <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                    Discover Local
                  </span>
                </span>
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Treasures
                </span>
                <span className="block mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent">
                  Around You
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-10 px-4 sm:px-6 leading-relaxed"
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
                className="flex flex-col items-center justify-center gap-4 px-4 sm:px-6 mb-10 sm:mb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleProtectedNavigation(e, "/map")}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto text-base sm:text-lg font-medium relative overflow-hidden min-h-[48px] flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Globe className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Explore Now
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto px-4"
              >
                {[
                  {
                    icon: <Building className="h-5 w-5 sm:h-6 sm:w-6" />,
                    number: "1000+",
                    label: "Businesses",
                  },
                  {
                    icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
                    number: "50K+",
                    label: "Users",
                  },
                  {
                    icon: <Star className="h-5 w-5 sm:h-6 sm:w-6" />,
                    number: "25K+",
                    label: "Reviews",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="text-center p-3 sm:p-4 bg-white/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 shadow-lg"
                  >
                    <div className="text-amber-600 mb-1 sm:mb-2 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Enhanced Featured Places Section */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-28 relative">
          <div className="absolute inset-0 bg-white" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-medium text-xs sm:text-sm mb-3 sm:mb-4 border border-amber-200">
                ✨ Handpicked Selection
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6 px-2">
                Featured Local
                <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Gems
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mx-auto px-4 max-w-3xl">
                Discover exceptional local businesses that our community loves
                most
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
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
                  className="group bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50"
                >
                  <div className="h-48 sm:h-56 overflow-hidden relative">
                    <Image
                      src={place.image}
                      alt={place.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
                        ⭐ Featured
                      </span>
                    </div>
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs sm:text-sm font-medium">
                          {place.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-amber-600 transition-colors">
                      {place.title}
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                      {place.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <Link href={`/business/${place.id}`}>
                        <motion.span
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center text-amber-600 font-medium hover:text-amber-700 text-sm sm:text-base"
                        >
                          Explore
                          <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                        </motion.span>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 sm:p-2.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-200 min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
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
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 font-medium inline-flex items-center text-sm sm:text-base min-h-[48px]"
                onClick={(e) => handleProtectedNavigation(e, "/map")}
              >
                View All Places
                <ArrowUpRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24 relative bg-gradient-to-b from-white to-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-3 sm:px-4 py-1 rounded-full bg-amber-100 text-amber-700 font-medium text-xs sm:text-sm mb-2 sm:mb-3">
                Simple Process
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight px-2">
                How LocalFinder Works<span className="text-amber-500">.</span>
              </h2>
              <p className="mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg lg:text-xl text-gray-600 mx-auto px-4">
                Find, discover, and connect with local businesses in just three
                simple steps
              </p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 md:grid-cols-3 relative">
                {[
                  {
                    step: 1,
                    icon: (
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                    ),
                    title: "Share Your Location",
                    description:
                      "Allow the app to use your location or search for an area you're interested in exploring",
                  },
                  {
                    step: 2,
                    icon: (
                      <Filter className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                    ),
                    title: "Apply Filters",
                    description:
                      "Filter by category, rating, or distance to find exactly what you're looking for",
                  },
                  {
                    step: 3,
                    icon: (
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                    ),
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
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-amber-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-300 relative">
                      <div className="pt-4 sm:pt-6 p-4 sm:p-6 text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl shadow-lg mx-auto mb-3 sm:mb-4">
                          {item.step}
                        </div>
                        <div className="rounded-xl bg-amber-100 p-2.5 sm:p-3 lg:p-4 inline-flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 text-amber-600">
                          {item.icon}
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 p-2.5 sm:p-3 lg:p-4 text-center">
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
                            <span className="hidden sm:inline">
                              Customize Your Search
                            </span>
                            <span className="sm:hidden">Customize</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition duration-300 font-medium inline-flex items-center text-sm sm:text-base min-h-[44px]"
                onClick={(e) => handleProtectedNavigation(e, "/map")}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-xs sm:text-sm lg:text-base font-semibold text-amber-600 tracking-wide uppercase">
                What People Say
              </h2>
              <h3 className="mt-2 text-2xl sm:text-3xl md:text-4xl leading-8 font-bold tracking-tight text-gray-900 px-2">
                Testimonials from Our Users
              </h3>
              <p className="mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg lg:text-xl text-gray-500 mx-auto px-4">
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
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2 sm:mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="inline-block h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400 mr-0.5 sm:mr-1"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {testimonial.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Call to action */}
            <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:shadow-lg transition duration-300 font-medium inline-flex items-center text-base sm:text-lg min-h-[48px]"
                onClick={(e) => handleProtectedNavigation(e, "/map")}
              >
                <span className="hidden sm:inline">
                  Start Exploring LocalFinder
                </span>
                <span className="sm:hidden">Start Exploring</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            </div>
          </div>
        </section>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full shadow-2xl mx-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Sign In Required
            </h3>
            <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
              Please sign in or create an account to access the map and discover
              local businesses.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
              <SignInButton mode="modal">
                <button className="w-full px-4 sm:px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm sm:text-base min-h-[44px]">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full px-4 sm:px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base min-h-[44px]">
                  Create Account
                </button>
              </SignUpButton>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-3 sm:mt-4 text-gray-500 hover:text-gray-700 text-sm w-full py-2"
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
