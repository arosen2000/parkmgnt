// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.pathname;
  console.log("Middleware is running for URL:", url);
  if (url.startsWith("/api/auth") || url.includes("/auth")) {
    console.log("Skipping middleware for NextAuth routes");
    return NextResponse.next(); // Skip middleware for NextAuth routes
  }
  // ... rest of your middleware logic
}
