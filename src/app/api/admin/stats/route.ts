import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface StatsRow extends RowDataPacket {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export async function GET() {
  try {
    // Get dashboard statistics
    const [stats] = await pool.query<StatsRow[]>(
      `SELECT 
        (SELECT COUNT(*) FROM products) as totalProducts,
        (SELECT COUNT(*) FROM orders) as totalOrders,
        (SELECT COUNT(*) FROM users) as totalCustomers,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE paymentStatus = 'paid') as totalRevenue,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pendingOrders,
        (SELECT COUNT(*) FROM orders WHERE status = 'delivered') as completedOrders`
    );

    const dashboardStats = stats[0];

    // Get recent orders (last 5)
    const [recentOrders] = await pool.query<RowDataPacket[]>(
      `SELECT 
        o.id,
        u.name as customerName,
        o.total,
        o.status,
        o.createdAt
      FROM orders o
      LEFT JOIN users u ON o.userId = u.id
      ORDER BY o.createdAt DESC
      LIMIT 5`
    );

    // Get top selling products
    const [topProducts] = await pool.query<RowDataPacket[]>(
      `SELECT 
        p.id,
        p.title,
        p.mainImage as image,
        SUM(oi.quantity) as sales
      FROM order_items oi
      JOIN products p ON oi.productId = p.id
      JOIN orders o ON oi.orderId = o.id
      WHERE o.paymentStatus = 'paid'
      GROUP BY p.id, p.title, p.mainImage
      ORDER BY sales DESC
      LIMIT 5`
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: Number(dashboardStats.totalProducts),
        totalOrders: Number(dashboardStats.totalOrders),
        totalCustomers: Number(dashboardStats.totalCustomers),
        totalRevenue: Number(dashboardStats.totalRevenue),
        pendingOrders: Number(dashboardStats.pendingOrders),
        completedOrders: Number(dashboardStats.completedOrders),
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.customerName || "N/A",
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
      })),
      topProducts: topProducts.map((product) => ({
        id: product.id,
        title: product.title,
        image: product.image || "/placeholder.svg",
        sales: Number(product.sales),
      })),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch stats";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stats",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
