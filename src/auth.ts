import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      console.log("[AUTH_TRACE] Session callback started.");
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
        console.log("[AUTH_TRACE] Session populated from token:", session.user);
      } else {
        console.log("[AUTH_TRACE] Session callback: No token found.");
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("[AUTH_TRACE] JWT callback started.");
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        console.log("[AUTH_TRACE] JWT populated from user object:", token);
      } else {
        console.log(
          "[AUTH_TRACE] JWT callback: No user object found, returning existing token."
        );
      }
      return token;
    },
  },
});
