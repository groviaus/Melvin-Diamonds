import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  let dbConnectionStatus = "pending";
  let dbError: string | null = null;

  try {
    const connection = await pool.getConnection();
    await connection.query("SELECT 1");
    connection.release();
    dbConnectionStatus = "✅ Connection successful";
  } catch (error) {
    dbConnectionStatus = "❌ Connection failed";
    if (error instanceof Error) {
      dbError = error.message;
    } else {
      dbError = "An unknown error occurred";
    }
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD_EXISTS: !!process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    GOOGLE_CLIENT_ID_EXISTS: !!process.env.GOOGLE_CLIENT_ID,
  };

  return NextResponse.json({
    environmentVariables: envVars,
    databaseConnection: {
      status: dbConnectionStatus,
      error: dbError,
    },
  });
}
