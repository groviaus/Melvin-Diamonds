import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    const connection = await pool.getConnection();
    console.log("Database connection successful");

    // Test orders table
    const [orders] = await connection.query(
      "SELECT COUNT(*) as count FROM orders"
    );
    console.log("Orders count:", orders);

    // Test order_items table
    const [orderItems] = await connection.query(
      "SELECT COUNT(*) as count FROM order_items"
    );
    console.log("Order items count:", orderItems);

    // Test table structure
    const [columns] = await connection.query("DESCRIBE order_items");
    console.log("Order items columns:", columns);

    connection.release();

    return NextResponse.json({
      success: true,
      orders: orders,
      orderItems: orderItems,
      columns: columns,
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database test failed",
      },
      { status: 500 }
    );
  }
}
