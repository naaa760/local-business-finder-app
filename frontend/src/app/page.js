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
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
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
                href="/map"
                className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                About
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
                onClick={(e) => handleProtectedNavigation(e, "/map")}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Explore Map
              </button>
            </div>
          </motion.div>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          {/* Featured places */}
          <div className="py-20 relative">
            {/* Background image */}
            <div
              className="absolute inset-0 z-0 opacity-15 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/b1.png')" }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-base font-semibold text-amber-600 tracking-wide uppercase">
                  Discover
                </h2>
                <h3 className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Featured Places
                </h3>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                  Explore these outstanding local businesses in your area
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mb-16"
              >
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
              </motion.div>
            </div>
          </div>

          {/* ===== NEW SECTION: HOW IT WORKS ===== */}
          <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-base font-semibold text-amber-600 tracking-wide uppercase">
                  Simple Process
                </h2>
                <h3 className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                  How LocalFinder Works
                </h3>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                  Find, discover, and connect with local businesses in just a
                  few steps
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative p-6 bg-white rounded-xl shadow-soft border border-gray-100"
                >
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div className="pt-4 text-center">
                    <div className="rounded-xl bg-amber-100 p-3 inline-block mb-4">
                      <MapPin className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Share Your Location
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Allow the app to use your location or search for an area
                      you&apos;re interested in exploring
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="relative p-6 bg-white rounded-xl shadow-soft border border-gray-100"
                >
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                  <div className="pt-4 text-center">
                    <div className="rounded-xl bg-amber-100 p-3 inline-block mb-4">
                      <Filter className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Apply Filters
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Filter by category, rating, or distance to find exactly
                      what you&apos;re looking for
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="relative p-6 bg-white rounded-xl shadow-soft border border-gray-100"
                >
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                  <div className="pt-4 text-center">
                    <div className="rounded-xl bg-amber-100 p-3 inline-block mb-4">
                      <Star className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Discover & Review
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Explore businesses, read reviews, and share your own
                      experiences with the community
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ===== NEW SECTION: FEATURED CITIES ===== */}
          <div className="py-20 bg-white relative">
            {/* Background image */}
            <div
              className="absolute inset-0 z-0 opacity-15 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/b3.png')" }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-base font-semibold text-amber-600 tracking-wide uppercase">
                  Popular Destinations
                </h2>
                <h3 className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Explore Top Cities
                </h3>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                  Discover the best local businesses in these popular locations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: "New York",
                    image:
                      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bmV3JTIweW9ya3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
                    businesses: 2500,
                    rating: 4.8,
                  },
                  {
                    name: "Los Angeles",
                    image:
                      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
                    businesses: 1800,
                    rating: 4.7,
                  },
                  {
                    name: "Chicago",
                    image:
                      "https://images.unsplash.com/photo-1484406566174-9da000fda645?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
                    businesses: 1200,
                    rating: 4.6,
                  },
                ].map((city, index) => (
                  <motion.div
                    key={city.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-xl shadow-lg group"
                  >
                    <div className="aspect-w-16 aspect-h-9 w-full">
                      <div className="h-60 w-full">
                        <Image
                          src={city.image}
                          alt={city.name}
                          fill
                          className="object-cover rounded-t-xl transform group-hover:scale-105 transition duration-500"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h4 className="text-2xl font-bold text-white">
                        {city.name}
                      </h4>
                      <div className="flex items-center mt-2 text-white/80">
                        <div className="flex items-center mr-4">
                          <Building className="w-4 h-4 mr-1" />
                          <span>{city.businesses}+ businesses</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-amber-400" />
                          <span>{city.rating} avg rating</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) =>
                          handleProtectedNavigation(e, `/map?city=${city.name}`)
                        }
                        className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm hover:bg-white/30 transition-colors"
                      >
                        Explore {city.name}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button
                  onClick={(e) => handleProtectedNavigation(e, "/map")}
                  className="px-6 py-3 bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition-colors text-sm font-medium"
                >
                  View All Cities
                </button>
              </div>
            </div>
          </div>

          {/* ===== NEW SECTION: TESTIMONIALS ===== */}
          <div className="py-20 bg-gradient-to-b from-white to-amber-50 relative">
            {/* Background image */}
            <div
              className="absolute inset-0 z-0 opacity-10 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/b4.png')" }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-base font-semibold text-amber-600 tracking-wide uppercase">
                  What People Say
                </h2>
                <h3 className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Testimonials from Our Users
                </h3>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                  See how LocalFinder is helping people discover amazing places
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    className="bg-white p-6 rounded-xl shadow-soft border border-gray-100"
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="inline-block h-4 w-4 fill-amber-400 text-amber-400 mr-1"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{testimonial.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== NEW SECTION: APP PREVIEW ===== */}
          <div className="py-20 bg-white relative">
            {/* Background image */}
            <div
              className="absolute inset-0 z-0 opacity-15 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/b5.png')" }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:flex items-center justify-between">
                <div className="md:w-1/2 mb-12 md:mb-0 pr-0 md:pr-16">
                  <h2 className="text-base font-semibold text-amber-600 tracking-wide uppercase">
                    Get The App
                  </h2>
                  <h3 className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Take LocalFinder With You
                  </h3>
                  <p className="mt-4 text-xl text-gray-500 max-w-2xl">
                    Download our mobile app to discover local businesses
                    wherever you go. Available for iOS and Android.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                      <svg
                        className="h-6 w-6 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.5781 12.0096C17.5781 11.0175 17.0098 10.1279 16.1328 9.66895L7.01562 4.54098C6.55664 4.28809 6.02539 4.20606 5.51758 4.30274C5.00977 4.39941 4.56055 4.6709 4.2627 5.07324C3.95508 5.48047 3.82812 5.99316 3.91211 6.49609C3.99609 6.99902 4.28125 7.44336 4.69336 7.73633L12.2109 12L4.69336 16.2637C4.28125 16.5566 3.99609 17.001 3.91211 17.5039C3.82812 18.0068 3.95508 18.5195 4.2627 18.9268C4.56055 19.3291 5.00977 19.6006 5.51758 19.6973C6.02539 19.7939 6.55664 19.7119 7.01562 19.459L16.1328 14.3311C17.0098 13.8721 17.5781 12.9824 17.5781 12.0096Z" />
                      </svg>
                      App Store
                    </button>
                    <button className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                      <svg
                        className="h-6 w-6 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3.66211 3.61621C3.48633 3.79199 3.375 4.05078 3.375 4.375V19.625C3.375 19.9492 3.48633 20.208 3.66211 20.3838L3.72656 20.4482L12.5273 11.6475V11.3525L3.72656 2.55176L3.66211 3.61621Z" />
                        <path d="M16.2188 14.9863L13.3711 12.1387V11.8613L16.2188 9.01367L16.2979 9.06348L19.6641 11.0312C20.625 11.5547 20.625 12.4453 19.6641 12.9688L16.2979 14.9365L16.2188 14.9863Z" />
                        <path d="M16.2979 14.9365L13.3711 12L4.52148 20.8496C4.87305 21.1865 5.40625 21.2217 6.01367 20.8848L16.2979 14.9365Z" />
                        <path d="M4.52148 3.15039L13.3711 12L16.2979 9.06348L6.01367 3.11523C5.40625 2.77832 4.87305 2.81348 4.52148 3.15039Z" />
                      </svg>
                      Google Play
                    </button>
                  </div>
                </div>
                <div className="md:w-1/2 relative">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative mx-auto md:ml-auto md:mr-0 w-64 h-[500px] bg-gray-900 rounded-[36px] border-[8px] border-gray-800 shadow-2xl overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 rounded-t-2xl"></div>
                    <div className="h-full w-full overflow-hidden">
                      <Image
                        src="/app-preview.jpg"
                        alt="Mobile App Preview"
                        width={320}
                        height={650}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-700 rounded-full"></div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
