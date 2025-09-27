import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import pool from "@/lib/db";

// Types for our product data
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  mainImage: string;
  galleryImages: string[];
  ringSizes: string[];
  categories: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Path to our JSON data file
const dataFilePath = path.join(process.cwd(), "data", "products.json");

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(dataFilePath);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read products from JSON file
async function readProductsFromFile(): Promise<Product[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Write products to JSON file
async function writeProductsToFile(products: Product[]) {
  await ensureDataDirectory();
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function parseMaybeJson<T>(value: unknown, fallback: T): T {
  try {
    if (Array.isArray(value)) return value as unknown as T;
    if (typeof value === "string") return JSON.parse(value) as T;
    if (value === null || value === undefined) return fallback;
    return value as T;
  } catch {
    return fallback;
  }
}

// GET /api/products - Get all products
export const runtime = "nodejs";

export async function GET() {
  try {
    interface ProductRow extends Record<string, unknown> {
      id: string;
      title: string;
      description: string;
      price: number;
      mainImage: string;
      galleryImages: unknown;
      ringSizes: unknown;
      categories: unknown;
      tags: unknown;
      createdAt: string;
      updatedAt: string;
    }
    const [rows] = await pool.query(
      "SELECT * FROM products ORDER BY createdAt DESC"
    );
    const normalized = (rows as ProductRow[]).map((row) => ({
      ...row,
      galleryImages: parseMaybeJson<string[]>(row.galleryImages, []),
      ringSizes: parseMaybeJson<string[]>(row.ringSizes, []),
      categories: parseMaybeJson<string[]>(row.categories, []),
      tags: parseMaybeJson<string[]>(row.tags, []),
    }));
    return NextResponse.json({ products: normalized });
  } catch (dbError) {
    console.warn(
      "Database connection failed, falling back to JSON file for GET products.",
      dbError
    );
    if (process.env.FILE_FALLBACK === "true") {
      try {
        const products = await readProductsFromFile();
        return NextResponse.json({ products });
      } catch (fileError) {
        return NextResponse.json(
          { error: "Failed to fetch products from both database and file" },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ products: [] });
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      mainImage,
      galleryImages = [],
      ringSizes = [],
      categories = [],
      tags = [],
    } = body;

    if (
      !title ||
      !description ||
      price === undefined ||
      price === null ||
      isNaN(Number(price)) ||
      !mainImage
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      id: generateId(),
      title,
      description,
      price: parseFloat(price),
      mainImage,
      galleryImages,
      ringSizes,
      categories,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const [result] = await pool.execute(
      `INSERT INTO products (id, title, description, price, mainImage, galleryImages, ringSizes, categories, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newProduct.id,
        newProduct.title,
        newProduct.description,
        newProduct.price,
        newProduct.mainImage,
        JSON.stringify(newProduct.galleryImages),
        JSON.stringify(newProduct.ringSizes),
        JSON.stringify(newProduct.categories),
        JSON.stringify(newProduct.tags),
      ]
    );

    if (
      !result ||
      (result as unknown as { affectedRows?: number }).affectedRows === 0
    ) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (dbError) {
    console.error("Database error during POST product:", dbError);
    return NextResponse.json(
      { error: "Failed to create product in database" },
      { status: 500 }
    );
  }
}
