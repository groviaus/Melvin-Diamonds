import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface OrderRow extends RowDataPacket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  razorpayOrderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  itemCount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  customerPhone: string | null;
}

interface OrderItemRow extends RowDataPacket {
  orderId: string;
  productId: string;
  productName: string;
  productDescription: string | null;
  productImage: string | null;
  productCategories: string;
  productTags: string;
  productDetails: string;
  productGalleryImages: string;
  productRingSizes: string;
  productPrice: number;
  selectedRingSize: string | null;
  quantity: number;
  price: number;
}

export async function GET() {
  try {
    // Get all orders with user info and item counts
    const [orders] = await pool.query<OrderRow[]>(
      `SELECT 
        o.id,
        o.userId,
        u.name as userName,
        u.email as userEmail,
        o.total,
        o.status,
        o.paymentStatus,
        o.paymentMethod,
        o.razorpayOrderId,
        o.createdAt,
        o.updatedAt,
        o.shippingAddress,
        o.shippingCity,
        o.shippingState,
        o.shippingZipCode,
        o.shippingCountry,
        o.customerPhone,
        COUNT(oi.id) as itemCount
      FROM orders o
      LEFT JOIN users u ON o.userId = u.id
      LEFT JOIN order_items oi ON o.id = oi.orderId
      GROUP BY o.id
      ORDER BY o.createdAt DESC`
    );

    // Get all order items with enhanced product details
    const [orderItems] = await pool.query<OrderItemRow[]>(
      `SELECT 
        oi.orderId,
        oi.productId,
        oi.productTitle as productName,
        oi.productDescription,
        oi.productImage,
        oi.productCategories,
        oi.productTags,
        oi.productDetails,
        oi.productGalleryImages,
        oi.productRingSizes,
        oi.productPrice,
        oi.size as selectedRingSize,
        oi.quantity,
        oi.price
      FROM order_items oi`
    );

    // Group items by orderId
    const itemsByOrder = orderItems.reduce(
      (acc, item) => {
        if (!acc[item.orderId]) {
          acc[item.orderId] = [];
        }
        acc[item.orderId].push({
          productId: item.productId,
          productName: item.productName,
          productDescription: item.productDescription,
          productImage: item.productImage,
          productCategories: item.productCategories
            ? JSON.parse(item.productCategories)
            : [],
          productTags: item.productTags ? JSON.parse(item.productTags) : [],
          productDetails: item.productDetails
            ? JSON.parse(item.productDetails)
            : [],
          productGalleryImages: item.productGalleryImages
            ? JSON.parse(item.productGalleryImages)
            : [],
          productRingSizes: item.productRingSizes
            ? JSON.parse(item.productRingSizes)
            : [],
          productPrice: Number(item.productPrice),
          selectedRingSize: item.selectedRingSize,
          quantity: item.quantity,
          price: Number(item.price),
        });
        return acc;
      },
      {} as Record<
        string,
        Array<{
          productId: string;
          productName: string;
          productDescription: string | null;
          productImage: string | null;
          productCategories: string[];
          productTags: string[];
          productDetails: string[];
          productGalleryImages: string[];
          productRingSizes: string[];
          productPrice: number;
          selectedRingSize: string | null;
          quantity: number;
          price: number;
        }>
      >
    );

    // Combine orders with their items
    const ordersWithItems = orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      userName: order.userName || "N/A",
      userEmail: order.userEmail,
      total: Number(order.total),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      razorpayOrderId: order.razorpayOrderId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemCount: Number(order.itemCount),
      items: itemsByOrder[order.id] || [],
      shippingAddress: {
        address: order.shippingAddress,
        city: order.shippingCity,
        state: order.shippingState,
        zipCode: order.shippingZipCode,
        country: order.shippingCountry,
      },
      customerPhone: order.customerPhone,
    }));

    return NextResponse.json({
      success: true,
      orders: ordersWithItems,
      total: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch orders";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
