import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = `user-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    await pool.query(
      "INSERT INTO users (id, name, email, password, provider) VALUES (?, ?, ?, ?, 'credentials')",
      [userId, name, email, hashedPassword]
    );

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: { id: userId, name, email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Return detailed error in development
    const errorMessage =
      error instanceof Error ? error.message : "Failed to register user";
    console.error("Detailed error:", errorMessage);

    return NextResponse.json(
      {
        error: "Failed to register user",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
