import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./auth";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth();
    const { nextUrl } = request;

    const isLoggedIn = !!session?.user;
    const userRole = session?.user?.role;
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    const isOnAdminPath = nextUrl.pathname.startsWith("/admin");
    const protectedUserPaths = ["/checkout", "/profile", "/orders"];
    const isOnUserPath = protectedUserPaths.some((path) =>
      nextUrl.pathname.startsWith(path)
    );

    // Protect admin routes
    if (isOnAdminPath) {
      if (!isLoggedIn) {
        // Redirect unauthenticated users to the sign-in page, saving the original URL
        const loginUrl = new URL("/auth/signin", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (!isAdmin) {
        // Redirect non-admins to the homepage
        return NextResponse.redirect(new URL("/", nextUrl.origin));
      }
    }

    // Protect standard user routes
    if (isOnUserPath) {
      if (!isLoggedIn) {
        const loginUrl = new URL("/auth/signin", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If middleware fails, allow the request to continue
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/profile/:path*", "/orders/:path*"],
};
