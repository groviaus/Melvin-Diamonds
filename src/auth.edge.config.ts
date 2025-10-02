import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config (no database access)
// This is used by middleware which runs in Edge Runtime
export const authEdgeConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnCheckout = nextUrl.pathname === "/checkout";
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnOrders = nextUrl.pathname.startsWith("/orders");

      // Skip authentication in development for admin panel
      if (process.env.NODE_ENV === "development" && isOnAdmin) {
        return true; // Allow admin access in development
      }

      if (isOnAdmin || isOnCheckout || isOnProfile || isOnOrders) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
  providers: [], // Providers are added in auth.config.ts for API routes
};
