import NextAuth from "next-auth";
import { authEdgeConfig } from "./auth.edge.config";

export const { auth: middleware } = NextAuth(authEdgeConfig);

export default middleware;

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/profile/:path*", "/orders/:path*"],
};
