"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BusinessForm from "@/components/BusinessForm";

export default function AddBusinessPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Add Business</h1>
        <p className="mt-4 text-gray-600">Please sign in to add a business.</p>
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

  // Check if user is a business owner
  const isBusinessOwner = user?.publicMetadata?.role === "business_owner";

  if (!isBusinessOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Add Business</h1>
        <p className="mt-4 text-gray-600">
          Only business owners can add listings. Please contact support to
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
        Add New Business
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <BusinessForm isEditing={false} />
      </div>
    </div>
  );
}
