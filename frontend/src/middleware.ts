import { clerkMiddleware } from "@clerk/nextjs/server";

// Basic middleware without complex config
export default clerkMiddleware();

// Very simple matcher that will work reliably
export const config = {
  matcher: ["/profile", "/business-dashboard", "/business-dashboard/:path*"],
};
