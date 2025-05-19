"use client";

import { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaLink,
  FaEnvelope,
} from "react-icons/fa";

export default function ShareButtons({ business, url }) {
  const [copied, setCopied] = useState(false);

  // Format content for sharing
  const title = `Check out ${business.name} on Local Business Finder!`;
  const description =
    business.description || `${business.name} in ${business.address}`;

  // Generate social sharing URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${title} ${url}`
  )}`;
  const emailSubject = encodeURIComponent(title);
  const emailBody = encodeURIComponent(`${title}\n\n${description}\n\n${url}`);
  const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  // Handle copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col space-y-3">
      <h3 className="font-medium text-gray-700">Share this business</h3>
      <div className="flex space-x-4">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
          aria-label="Share on Facebook"
        >
          <FaFacebook size={18} />
        </a>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition"
          aria-label="Share on Twitter"
        >
          <FaTwitter size={18} />
        </a>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition"
          aria-label="Share on LinkedIn"
        >
          <FaLinkedin size={18} />
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp size={18} />
        </a>

        <a
          href={emailUrl}
          className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600 transition"
          aria-label="Share via Email"
        >
          <FaEnvelope size={18} />
        </a>

        <button
          onClick={copyToClipboard}
          className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition"
          aria-label="Copy link"
        >
          <FaLink size={18} />
        </button>
      </div>

      {copied && (
        <div className="text-green-600 text-sm animate-fade-in-out">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
