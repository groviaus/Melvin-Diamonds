import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
          const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ? AND provider = 'credentials'",
            [credentials.email]
          );

          const users = rows as unknown[];
          const user = users[0] as {
            id: string;
            email: string;
            name: string;
            password: string;
            image?: string;
          };

          if (!user || !user.password) {
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
          };
        } catch (error) {
          console.error("Auth error:", error);
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
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );
          const users = rows as unknown[];

          if ((users as unknown[]).length === 0) {
            // Create new user
            const userId = `google-${Date.now()}`;
            await pool.query(
              "INSERT INTO users (id, name, email, image, provider, emailVerified) VALUES (?, ?, ?, ?, 'google', NOW())",
              [userId, user.name, user.email, user.image]
            );
            user.id = userId;
          } else {
            user.id = (users[0] as { id: string }).id;
          }

          return true;
        } catch (error) {
          console.error("Sign in error:", error);
          return false;
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
