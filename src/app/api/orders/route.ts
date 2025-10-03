import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2";

interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  size: string | null;
  quantity: number;
}

interface RequestBody {
  shippingInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  saveAddress: boolean;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: RequestBody = await req.json();
    const {
      shippingInfo,
      saveAddress,
      items,
      subtotal,
      shippingCost,
      tax,
      total,
    } = body;
    const userId = session.user.id;

    // --- Data Validation ---
    if (
      !shippingInfo ||
      !items ||
      items.length === 0 ||
      !total ||
      !shippingInfo.email
    ) {
      return NextResponse.json(
        { error: "Missing required order data" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Create the Order
      const orderId = uuidv4();
      const orderNumber = `${Date.now()}-${userId.slice(-4)}`;

      await connection.query(
        `INSERT INTO orders (id, userId, orderNumber, customerName, customerEmail, customerPhone, shippingFirstName, shippingLastName, shippingAddress, shippingApartment, shippingCity, shippingState, shippingZipCode, subtotal, shippingCost, tax, total, paymentMethod, paymentStatus, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          userId,
          orderNumber,
          `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          shippingInfo.email,
          shippingInfo.phone,
          shippingInfo.firstName,
          shippingInfo.lastName,
          shippingInfo.address,
          shippingInfo.apartment,
          shippingInfo.city,
          shippingInfo.state,
          shippingInfo.zipCode,
          subtotal,
          shippingCost,
          tax,
          total,
          "cod", // 'cod' for "Cash on Delivery" since we're skipping payment
          "pending", // Payment status
          "pending", // Order status
        ]
      );

      // 2. Create Order Items
      const orderItemsQueries = items.map((item) => {
        const itemId = uuidv4();
        // Fetch product details to store a snapshot
        return connection.query(
          `INSERT INTO order_items (id, orderId, productId, productTitle, productImage, productDescription, size, quantity, price, subtotal)
           SELECT ?, ?, ?, p.title, p.mainImage, p.description, ?, ?, ?, ?
           FROM products p WHERE p.id = ?`,
          [
            itemId,
            orderId,
            item.productId,
            item.size,
            item.quantity,
            item.price,
            item.price * item.quantity,
            item.productId,
          ]
        );
      });

      await Promise.all(orderItemsQueries);

      // 3. (Optional) Save the address if requested
      if (saveAddress) {
        // Check if this should be the default address
        const [existingAddresses] = await connection.query<RowDataPacket[]>(
          "SELECT id FROM addresses WHERE userId = ?",
          [userId]
        );
        const isDefault = existingAddresses.length === 0;

        const addressId = uuidv4();
        await connection.query(
          `INSERT INTO addresses (id, userId, isDefault, firstName, lastName, email, phone, address, apartment, city, state, zipCode, country)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            addressId,
            userId,
            isDefault,
            shippingInfo.firstName,
            shippingInfo.lastName,
            shippingInfo.email,
            shippingInfo.phone,
            shippingInfo.address,
            shippingInfo.apartment,
            shippingInfo.city,
            shippingInfo.state,
            shippingInfo.zipCode,
            "India", // Assuming default country for now
          ]
        );
      }

      await connection.commit();

      return NextResponse.json(
        {
          success: true,
          message: "Order placed successfully",
          orderId: orderId,
          orderNumber: orderNumber,
        },
        { status: 201 }
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Failed to create order:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to create order", details: errorMessage },
      { status: 500 }
    );
  }
}
