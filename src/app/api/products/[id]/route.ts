import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types";
import pool from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export const runtime = "nodejs";

// GET /api/products/[id] - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    interface ProductRow extends RowDataPacket {
      id: string;
      title: string;
      description: string;
      price: number;
      mainImage: string;
      galleryImages: unknown;
      ringSizes: unknown;
      categories: unknown;
      tags: unknown;
      details: unknown;
      createdAt: string;
      updatedAt: string;
    }
    const [rows] = await pool.query<ProductRow[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const row = rows[0];
    const product: Product = {
      ...row,
      galleryImages:
        typeof row.galleryImages === "string"
          ? JSON.parse(row.galleryImages)
          : row.galleryImages ?? [],
      ringSizes:
        typeof row.ringSizes === "string"
          ? JSON.parse(row.ringSizes)
          : row.ringSizes ?? [],
      categories:
        typeof row.categories === "string"
          ? JSON.parse(row.categories)
          : row.categories ?? [],
      tags:
        typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags ?? [],
      details:
        typeof row.details === "string"
          ? JSON.parse(row.details)
          : row.details ?? [],
    };
    return NextResponse.json({ product });
  } catch (dbError) {
    console.error(`Database error getting product`, dbError);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      price,
      mainImage,
      galleryImages,
      ringSizes,
      categories,
      tags,
      details,
    } = body;

    // Build query dynamically based on fields provided
    const fields = [];
    const values = [];
    if (title) {
      fields.push("title = ?");
      values.push(title);
    }
    if (description) {
      fields.push("description = ?");
      values.push(description);
    }
    if (price) {
      fields.push("price = ?");
      values.push(price);
    }
    if (mainImage) {
      fields.push("mainImage = ?");
      values.push(mainImage);
    }
    if (galleryImages) {
      fields.push("galleryImages = ?");
      values.push(JSON.stringify(galleryImages));
    }
    if (ringSizes) {
      fields.push("ringSizes = ?");
      values.push(JSON.stringify(ringSizes));
    }
    if (categories) {
      fields.push("categories = ?");
      values.push(JSON.stringify(categories));
    }
    if (tags) {
      fields.push("tags = ?");
      values.push(JSON.stringify(tags));
    }
    if (details) {
      fields.push("details = ?");
      values.push(JSON.stringify(details));
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(id);
    const query = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

    const [result] = await pool.execute<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch and return the updated product
    interface ProductRow extends RowDataPacket {
      id: string;
      title: string;
      description: string;
      price: number;
      mainImage: string;
      galleryImages: unknown;
      ringSizes: unknown;
      categories: unknown;
      tags: unknown;
      details: unknown;
      createdAt: string;
      updatedAt: string;
    }
    const [updatedRows] = await pool.query<ProductRow[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    const row = (updatedRows as ProductRow[])[0];
    const product: Product = {
      ...row,
      galleryImages:
        typeof row.galleryImages === "string"
          ? JSON.parse(row.galleryImages)
          : row.galleryImages ?? [],
      ringSizes:
        typeof row.ringSizes === "string"
          ? JSON.parse(row.ringSizes)
          : row.ringSizes ?? [],
      categories:
        typeof row.categories === "string"
          ? JSON.parse(row.categories)
          : row.categories ?? [],
      tags:
        typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags ?? [],
      details:
        typeof row.details === "string"
          ? JSON.parse(row.details)
          : row.details ?? [],
    };
    return NextResponse.json({ product });
  } catch (dbError) {
    console.error(`Database error updating product`, dbError);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (dbError) {
    console.error(`Database error deleting product:`, dbError);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
