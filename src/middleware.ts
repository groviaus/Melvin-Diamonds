import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes (admin panel)
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin?from=admin", req.url));
    }
    // You can add admin role check here later
  }

  // Checkout requires authentication
  if (pathname === "/checkout" && !isLoggedIn) {
    return NextResponse.redirect(
      new URL("/auth/signin?from=checkout", req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/profile/:path*", "/orders/:path*"],
};
