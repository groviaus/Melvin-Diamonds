import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Product } from "../route";
import pool from "@/lib/db";

// Path to our JSON data file
const dataFilePath = path.join(process.cwd(), "data", "products.json");

// Read products from JSON file
async function readProductsFromFile(): Promise<Product[]> {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write products to JSON file
async function writeProductsToFile(products: Product[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
}

// GET /api/products/[id] - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows]: any[] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [params.id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: rows[0] });
  } catch (dbError) {
    console.error(`Database error getting product ${params.id}:`, dbError);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(params.id);
    const query = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

    const [result]: any = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch and return the updated product
    const [updatedRows]: any[] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [params.id]
    );

    return NextResponse.json({ product: updatedRows[0] });
  } catch (dbError) {
    console.error(`Database error updating product ${params.id}:`, dbError);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [result]: any = await pool.execute(
      "DELETE FROM products WHERE id = ?",
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (dbError) {
    console.error(`Database error deleting product ${params.id}:`, dbError);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
