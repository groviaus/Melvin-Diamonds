import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config for middleware
// This config doesn't include database operations or Node.js-specific modules
export const authEdgeConfig: NextAuthConfig = {
    trustHost: true,
    providers: [],
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};
