import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    const [rows] = await pool.query("SELECT 1 as test");

    // Test if users table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'users'");

    // Test if products table exists
    const [productsTables] = await pool.query("SHOW TABLES LIKE 'products'");

    // Test if orders table exists
    const [ordersTables] = await pool.query("SHOW TABLES LIKE 'orders'");

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      testQuery: rows,
      tables: {
        users: (tables as unknown[]).length > 0,
        products: (productsTables as unknown[]).length > 0,
        orders: (ordersTables as unknown[]).length > 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Database test error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
