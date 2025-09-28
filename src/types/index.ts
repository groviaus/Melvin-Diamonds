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
  details: string[];
  createdAt: string;
  updatedAt: string;
}

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
