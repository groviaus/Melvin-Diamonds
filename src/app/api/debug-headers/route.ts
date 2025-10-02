import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const headers = req.headers;
  const info = {
    url: req.url,
    method: "GET",
    host: headers.get("host"),
    xForwardedHost: headers.get("x-forwarded-host"),
    xForwardedProto: headers.get("x-forwarded-proto"),
    xRealIp: headers.get("x-real-ip"),
    cfConnectingIp: headers.get("cf-connecting-ip"),
    forwarded: headers.get("forwarded"),
    nodeEnv: process.env.NODE_ENV,
    nextauth: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      AUTH_URL: process.env.AUTH_URL,
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
      AUTH_ALLOWED_HOSTS: process.env.AUTH_ALLOWED_HOSTS,
    },
  };
  return NextResponse.json(info);
}
