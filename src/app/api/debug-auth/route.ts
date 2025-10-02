import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Test 1: Basic database connection (same as test-db)
    const [rows] = await pool.query("SELECT 1 as test");
    const dbConnection = "✅ Database connection successful";

    // Test 2: Check if users table exists and has data
    const [tables] = await pool.query("SHOW TABLES LIKE 'users'");
    const usersTableExists = (tables as unknown[]).length > 0 ? "✅ Users table exists" : "❌ Users table missing";

    // Test 3: Check if test user exists (same query as NextAuth)
    const [userRows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND provider = 'credentials'",
      ['test@example.com']
    );
    const testUserExists = (userRows as unknown[]).length > 0 ? "✅ Test user exists" : "❌ Test user missing";

    // Test 4: Try to hash password (same as NextAuth)
    let passwordHashTest = "❌ Password hashing failed";
    try {
      const testPassword = "password123";
      const hashed = await bcrypt.hash(testPassword, 10);
      passwordHashTest = "✅ Password hashing works";
    } catch (error) {
      passwordHashTest = `❌ Password hashing error: ${error instanceof Error ? error.message : 'Unknown'}`;
    }

    // Test 5: Check environment variables
    const envVars = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing",
      DB_HOST: process.env.DB_HOST ? "✅ Set" : "❌ Missing",
      DB_USER: process.env.DB_USER ? "✅ Set" : "❌ Missing",
      DB_PASSWORD: process.env.DB_PASSWORD ? "✅ Set" : "❌ Missing",
      DB_NAME: process.env.DB_NAME ? "✅ Set" : "❌ Missing",
    };

    return NextResponse.json({
      success: true,
      debug: {
        database: dbConnection,
        usersTable: usersTableExists,
        testUser: testUserExists,
        passwordHash: passwordHashTest,
        environment: envVars,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Debug auth error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Debug check failed",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

