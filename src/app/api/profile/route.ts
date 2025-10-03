import { NextResponse } from "next/server";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function PUT(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const [result] = await pool.query(
      "UPDATE users SET name = ? WHERE id = ?",
      [name.trim(), session.user.id]
    );

    const updateResult = result as ResultSetHeader;
    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or name is the same." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, name: name.trim() });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
