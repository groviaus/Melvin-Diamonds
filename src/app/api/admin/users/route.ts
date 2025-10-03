import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  provider: string;
  createdAt: Date;
  orderCount: number;
  totalSpent: number;
}

interface AddressRow extends RowDataPacket {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export async function GET() {
  try {
    // Get all users with their order stats
    const [users] = await pool.query<UserRow[]>(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.image,
        u.provider,
        u.createdAt,
        COUNT(DISTINCT o.id) as orderCount,
        COALESCE(SUM(o.total), 0) as totalSpent
      FROM users u
      LEFT JOIN orders o ON u.id = o.userId
      GROUP BY u.id, u.name, u.email, u.image, u.provider, u.createdAt
      ORDER BY u.createdAt DESC`
    );

    // Get addresses for all users
    const [addresses] = await pool.query<AddressRow[]>(
      `SELECT * FROM addresses ORDER BY userId, isDefault DESC`
    );

    // Group addresses by userId
    const addressesByUser = addresses.reduce((acc, addr) => {
      if (!acc[addr.userId]) {
        acc[addr.userId] = [];
      }
      acc[addr.userId].push(addr);
      return acc;
    }, {} as Record<string, AddressRow[]>);

    // Combine users with their addresses
    const usersWithAddresses = users.map((user) => ({
      id: user.id,
      name: user.name || "N/A",
      email: user.email,
      image: user.image,
      provider: user.provider,
      createdAt: user.createdAt,
      orderCount: Number(user.orderCount),
      totalSpent: Number(user.totalSpent),
      addresses: addressesByUser[user.id] || [],
    }));

    return NextResponse.json({
      success: true,
      users: usersWithAddresses,
      total: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
