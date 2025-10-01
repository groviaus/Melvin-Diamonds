import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    const [rows] = await pool.query("SELECT 1 as test");

    // Test if users table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'users'");

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      testQuery: rows,
      usersTableExists: (tables as unknown[]).length > 0,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Database test error:", error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
