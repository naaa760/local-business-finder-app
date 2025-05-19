"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BusinessForm from "@/components/BusinessForm";

export default function EditBusinessPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && id) {
      fetchBusiness();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, id]);

  const fetchBusiness = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch business");
      const data = await response.json();
      setBusiness(data);
    } catch (err) {
      console.error("Error fetching business:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Business</h1>
        <p className="mt-4 text-gray-600">Please sign in to edit a business.</p>
        <div className="mt-6">
          <Link
            href="/sign-in"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-600">{error}</p>
        <div className="mt-6">
          <Link
            href="/business-dashboard"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is a business owner
  const isBusinessOwner = user?.publicMetadata?.role === "business_owner";

  if (!isBusinessOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Business</h1>
        <p className="mt-4 text-gray-600">
          Only business owners can edit listings. Please contact support to
          upgrade your account.
        </p>
        <div className="mt-6">
          <Link
            href="/map"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Map
          </Link>
        </div>
      </div>
    );
  }

  // Check if business exists
  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Business Not Found</h1>
        <p className="mt-4 text-gray-600">
          The business you are trying to edit does not exist.
        </p>
        <div className="mt-6">
          <Link
            href="/business-dashboard"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          href="/business-dashboard"
          className="text-blue-600 hover:text-blue-800 mr-2"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Edit Business: {business.name}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <BusinessForm business={business} isEditing={true} />
      </div>
    </div>
  );
}
