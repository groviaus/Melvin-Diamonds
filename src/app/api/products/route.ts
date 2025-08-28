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

// GET /api/products - Get all products
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products ORDER BY createdAt DESC"
    );
    // The JSON columns will be automatically parsed
    return NextResponse.json({ products: rows });
  } catch (dbError) {
    console.warn(
      "Database connection failed, falling back to JSON file for GET products.",
      dbError
    );
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

    if (!title || !description || !price || !mainImage) {
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

    await pool.execute(
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

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (dbError) {
    console.error("Database error during POST product:", dbError);
    return NextResponse.json(
      { error: "Failed to create product in database" },
      { status: 500 }
    );
  }
}
