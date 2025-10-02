import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

interface UserFromDb {
  id: string;
  name: string;
  email: string;
  image: string | null;
  provider: "google" | "credentials";
  emailVerified: Date | null;
  role: "user" | "admin";
  password?: string | null;
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check if database is available first
          await pool.query("SELECT 1");

          const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ? AND provider = 'credentials'",
            [credentials.email]
          );

          const users = rows as UserFromDb[];
          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          if (!user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!passwordsMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          // If database is unavailable, return null instead of crashing
          console.error("Database unavailable during auth:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );
          const users = rows as UserFromDb[];

          if (users.length === 0) {
            // Create new user with default 'user' role
            const userId = `google-${Date.now()}`;
            await pool.query(
              "INSERT INTO users (id, name, email, image, provider, emailVerified, role) VALUES (?, ?, ?, ?, 'google', NOW(), 'user')",
              [userId, user.name, user.email, user.image]
            );
            user.id = userId;
            user.role = "user";
          } else {
            const existingUser = users[0];
            user.id = existingUser.id;
            user.role = existingUser.role || "user";
          }

          return true;
        } catch (error) {
          // If database is unavailable, still allow Google sign-in but log the error
          console.error("Google sign-in database error:", error);
          // For Google auth, we can still proceed if user exists in session
          // The database error will be handled gracefully
          return true;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
