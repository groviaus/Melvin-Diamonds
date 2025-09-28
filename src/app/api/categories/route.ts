import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import pool from "@/lib/db";

export const runtime = "nodejs";

// Types for our category data
export interface Subcategory {
  id: string;
  name: string;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryData {
  categories: Category[];
}

// Path to our JSON data file
const dataFilePath = path.join(process.cwd(), "data", "categories.json");

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(dataFilePath);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read categories from JSON file
async function readCategoriesFromFile(): Promise<CategoryData> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or is invalid, return default structure
    return { categories: [] };
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper to recursively build the category tree from a flat list
type FlatCategory = {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

function buildTree(
  categories: FlatCategory[],
  parentId: string | null = null
): Category[] {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      subcategories: buildTree(categories, category.id) as Subcategory[],
    }));
}

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM categories ORDER BY createdAt ASC"
    );
    const tree = buildTree(rows as FlatCategory[]);
    return NextResponse.json({ categories: tree });
  } catch (dbError) {
    console.warn(
      "Database connection failed, falling back to JSON file for GET.",
      dbError
    );
    try {
      const categoryData = await readCategoriesFromFile();
      return NextResponse.json(categoryData);
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch categories from both database and file" },
        { status: 500 }
      );
    }
  }
}

// POST /api/categories - Create new category or subcategory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, parentId = null } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const newCategory = {
      id: generateId(),
      name: name.trim(),
      parentId,
    };

    await pool.execute(
      "INSERT INTO categories (id, name, parentId) VALUES (?, ?, ?)",
      [newCategory.id, newCategory.name, newCategory.parentId]
    );

    // To return the full object including subcategories array
    const createdCategory = {
      ...newCategory,
      subcategories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ category: createdCategory }, { status: 201 });
  } catch (dbError) {
    console.error("Database error during POST:", dbError);
    // Fallback logic for POST could be complex, for now we return an error
    return NextResponse.json(
      { error: "Failed to create category in database" },
      { status: 500 }
    );
  }
}

// PUT /api/categories - Update category or subcategory
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || !name || !name.trim()) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name.trim(), id]
    );

    if ((result as unknown as { affectedRows?: number }).affectedRows === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (dbError) {
    console.error("Database error during PUT:", dbError);
    return NextResponse.json(
      { error: "Failed to update category in database" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories - Delete category or subcategory
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [
      id,
    ]);

    if ((result as unknown as { affectedRows?: number }).affectedRows === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (dbError) {
    console.error("Database error during DELETE:", dbError);
    return NextResponse.json(
      { error: "Failed to delete category from database" },
      { status: 500 }
    );
  }
}
