import { NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email, image, role FROM users WHERE id = ?",
      [session.user.id]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [addresses] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM addresses WHERE userId = ? ORDER BY isDefault DESC, createdAt DESC",
      [session.user.id]
    );

    return NextResponse.json({ user: users[0], addresses });
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, image } = body;

    if (!name && !image) {
      return NextResponse.json(
        { error: "Name or image is required for update." },
        { status: 400 }
      );
    }

    let query = "UPDATE users SET";
    const params = [];
    if (name) {
      query += " name = ?";
      params.push(name.trim());
    }
    if (image) {
      query += name ? ", image = ?" : " image = ?";
      params.push(image);
    }
    query += " WHERE id = ?";
    params.push(session.user.id);

    const [result] = await pool.query(query, params);

    const updateResult = result as ResultSetHeader;
    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or data is the same." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      name: name?.trim(),
      image: image,
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
