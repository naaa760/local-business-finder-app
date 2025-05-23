import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Local Business Finder",
  description: "Find and discover local businesses around the world",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Local Business Finder",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Local Business Finder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Business Finder",
    description: "Discover great local businesses in your area",
    images: ["https://yourdomain.com/twitter-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="overflow-x-hidden">
        <body className={`${inter.className} overflow-x-hidden w-full`}>
          <main className="min-h-screen w-full overflow-x-hidden">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
