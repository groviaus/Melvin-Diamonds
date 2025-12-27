import NextAuth from "next-auth";

// Minimal Edge-compatible auth configuration for middleware
// This MUST NOT import any Node.js modules like mysql2, bcrypt, etc.
export const { auth } = NextAuth({
    trustHost: true,
    providers: [], // Empty providers array for middleware
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            // Read user info from JWT token
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.image as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            // Store user info in JWT token
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                token.role = user.role;
            }
            return token;
        },
    },
});
