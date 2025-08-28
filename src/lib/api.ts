import { Product } from "@/app/api/products/route";
import {
  CategoryData,
  Category,
  Subcategory,
} from "@/app/api/categories/route";

const API_BASE = "/api";

// Product API functions
export const productAPI = {
  // Get all products
  async getAll(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data.products;
  },

  // Get product by ID
  async getById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    const data = await response.json();
    return data.product;
  },

  // Create new product
  async create(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Failed to create product");
    }
    const data = await response.json();
    return data.product;
  },

  // Update product
  async update(
    id: string,
    productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    const data = await response.json();
    return data.product;
  },

  // Delete product
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  },
};

// Upload API functions
export const uploadAPI = {
  // Upload single image
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return { url: data.url, filename: data.filename };
  },

  // Upload multiple images
  async uploadImages(
    files: File[]
  ): Promise<{ url: string; filename: string }[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  },
};

// Category API functions
export const categoryAPI = {
  // Get all categories
  async getAll(): Promise<CategoryData> {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  },

  // Create new category or subcategory
  async create(data: {
    name: string;
    parentId?: string;
  }): Promise<Category | Subcategory> {
    const response = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    const result = await response.json();
    return result.category || result.subcategory;
  },

  // Update category or subcategory
  async update(id: string, name: string): Promise<void> {
    const response = await fetch(`${API_BASE}/categories`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name }),
    });
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
  },

  // Delete category or subcategory
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/categories?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
  },
};
