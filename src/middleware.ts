import NextAuth from "next-auth";
import { authEdgeConfig } from "./auth.edge.config";

export const { auth: middleware } = NextAuth({
  ...authEdgeConfig,
  callbacks: {
    ...authEdgeConfig.callbacks,
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const isAdmin = userRole === "admin" || userRole === "super_admin";

      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnCheckout = nextUrl.pathname === "/checkout";
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnOrders = nextUrl.pathname.startsWith("/orders");

      // Admin routes require admin role
      if (isOnAdmin) {
        if (!isLoggedIn) {
          return false; // Redirect to signin
        }
        if (!isAdmin) {
          return false; // Redirect to signin (insufficient permissions)
        }
        return true;
      }

      // User-specific routes require authentication
      if (isOnCheckout || isOnProfile || isOnOrders) {
        if (isLoggedIn) return true;
        return false; // Redirect to signin
      }

      return true;
    },
  },
});

export default middleware;

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/profile/:path*", "/orders/:path*"],
};
