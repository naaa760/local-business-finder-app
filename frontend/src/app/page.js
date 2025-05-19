"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-black bg-opacity-90 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white font-bold text-xl">
              Local Business Finder
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/map" className="text-gray-300 hover:text-white">
                Explore Map
              </Link>
              {isSignedIn && (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-300 hover:text-white"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/business-dashboard"
                    className="text-gray-300 hover:text-white"
                  >
                    Business Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-white hover:text-blue-200 px-4 py-2">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                    Sign Up →
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-20">
        <div className="flex flex-col items-center text-center">
          {/* Meet Badge */}
          <div className="mb-6 bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-gray-800">Meet Local Business Finder</span>
            <span className="bg-black text-white p-1 rounded-md">📱</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-[64px] font-semibold mb-6 max-w-4xl leading-[1.1] tracking-tight text-gray-900">
            The personal finance app
            <br />
            for everyone
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 max-w-2xl">
            Maybe is an all-in-one personal finance platform. Track, optimize,
            grow, and manage your money through every stage of life.
          </p>

          {/* CTA Button */}
          <button className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-all duration-200 mb-8">
            Start your free trial
          </button>

          {/* Additional Text */}
          <p className="text-gray-600 text-sm">
            You can also{" "}
            <Link
              href="/self-host"
              className="text-gray-800 underline hover:text-gray-900"
            >
              self-host
            </Link>{" "}
            Maybe.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-12">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.291 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="font-medium">44.2k</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-blue-500"
                fill="currentColor"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              <span className="font-medium">5.4k</span>
            </div>
          </div>
        </div>

        {/* Graph Background */}
        <div className="relative mt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10"></div>
          <div className="h-[400px] w-full bg-[url('/graph-bg.svg')] bg-contain bg-center"></div>
        </div>
      </main>
    </div>
  );
}
