import { Product, CategoryData, Category, Subcategory } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

// Get headers for API requests
const getHeaders = () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  return headers;
};

// Get fetch options with no-cache for live API calls
const getFetchOptions = (
  method: string = "GET",
  body?: unknown
): RequestInit => {
  const options: RequestInit = {
    method,
    headers: getHeaders(),
    cache: "no-store", // Disable caching for live data
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// Product API functions
export const productAPI = {
  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      const url = `${API_BASE}/products`;
      console.log("Fetching products from:", url);
      const response = await fetch(url, getFetchOptions("GET"));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Products API error:", response.status, errorText);
        throw new Error(
          `Failed to fetch products: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Products fetched successfully:", data.products?.length || 0);
      return data.products;
    } catch (error) {
      console.error("Products API error:", error);
      throw error;
    }
  },

  // Get product by ID
  async getById(id: string): Promise<Product> {
    try {
      const url = `${API_BASE}/products/${id}`;
      console.log("Fetching product from:", url);
      const response = await fetch(url, getFetchOptions("GET"));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Product API error:", response.status, errorText);
        throw new Error(
          `Failed to fetch product: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error("Product API error:", error);
      throw error;
    }
  },

  // Create new product
  async create(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const response = await fetch(
      `${API_BASE}/products`,
      getFetchOptions("POST", productData)
    );
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
    const response = await fetch(
      `${API_BASE}/products/${id}`,
      getFetchOptions("PUT", productData)
    );
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    const data = await response.json();
    return data.product;
  },

  // Delete product
  async delete(id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE}/products/${id}`,
      getFetchOptions("DELETE")
    );
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

    const headers = getHeaders();
    // Remove Content-Type for FormData uploads
    delete headers["Content-Type"];

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers,
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
    try {
      const url = `${API_BASE}/categories`;
      console.log("Fetching categories from:", url);
      const response = await fetch(url, getFetchOptions("GET"));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Categories API error:", response.status, errorText);
        throw new Error(
          `Failed to fetch categories: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(
        "Categories fetched successfully:",
        data.categories?.length || 0
      );
      return data;
    } catch (error) {
      console.error("Categories API error:", error);
      throw error;
    }
  },

  // Create new category or subcategory
  async create(data: {
    name: string;
    parentId?: string;
  }): Promise<Category | Subcategory> {
    const response = await fetch(
      `${API_BASE}/categories`,
      getFetchOptions("POST", data)
    );
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    const result = await response.json();
    return result.category || result.subcategory;
  },

  // Update category or subcategory
  async update(id: string, name: string): Promise<void> {
    const response = await fetch(
      `${API_BASE}/categories`,
      getFetchOptions("PUT", { id, name })
    );
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
  },

  // Delete category or subcategory
  async delete(id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE}/categories?id=${id}`,
      getFetchOptions("DELETE")
    );
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
  },
};
