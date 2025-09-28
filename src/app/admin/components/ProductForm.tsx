"use client";

import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { XIcon, UploadIcon, PlusIcon, Loader2Icon } from "lucide-react";
import { productAPI, uploadAPI, categoryAPI } from "@/lib/api";
import { Product, Category, Subcategory } from "@/types";
import { resolveMediaUrl } from "@/lib/utils";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  mainImage: File | null;
  mainImageUrl: string;
  galleryImages: File[];
  galleryImageUrls: string[];
  ringSizes: string[];
  categories: string[];
  tags: string[];
  details: string;
}

const defaultRingSizes = [
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
];
const defaultTags = [
  "Diamond",
  "Gold",
  "Silver",
  "Platinum",
  "Vintage",
  "Modern",
  "Classic",
];

interface CategoryOption {
  id: string;
  name: string;
  level: number;
}

function flattenCategories(
  categories: Category[],
  level = 0
): CategoryOption[] {
  const result: CategoryOption[] = [];

  for (const category of categories) {
    result.push({
      id: category.id,
      name: category.name,
      level,
    });

    if (category.subcategories) {
      result.push(...flattenSubcategories(category.subcategories, level + 1));
    }
  }

  return result;
}

function flattenSubcategories(
  subcategories: Subcategory[],
  level: number
): CategoryOption[] {
  const result: CategoryOption[] = [];

  for (const subcategory of subcategories) {
    result.push({
      id: subcategory.id,
      name: subcategory.name,
      level,
    });

    if (subcategory.subcategories) {
      result.push(
        ...flattenSubcategories(subcategory.subcategories, level + 1)
      );
    }
  }

  return result;
}

interface ProductFormProps {
  editingProduct?: Product | null;
  onProductSaved?: () => void;
}

export default function ProductForm({
  editingProduct,
  onProductSaved,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    mainImage: null,
    mainImageUrl: "",
    galleryImages: [],
    galleryImageUrls: [],
    ringSizes: [],
    categories: [],
    tags: [],
    details: "",
  });

  const [newRingSize, setNewRingSize] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [categorySelectionPath, setCategorySelectionPath] = useState<
    (Category | Subcategory)[]
  >([]);

  // Fetch categories on component mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoryData = await categoryAPI.getAll();
        setAvailableCategories(categoryData.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert("Failed to load categories. Please try again.");
      }
    }
    loadCategories();
  }, []);

  // Populate form when editing product
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        mainImage: null,
        mainImageUrl: editingProduct.mainImage,
        galleryImages: [],
        galleryImageUrls: editingProduct.galleryImages,
        ringSizes: editingProduct.ringSizes,
        categories: editingProduct.categories,
        tags: editingProduct.tags,
        details: editingProduct.details?.join("\n") || "",
      });
      setEditingProductId(editingProduct.id);
      setIsEditing(true);
    } else {
      // Reset form when not editing
      setFormData({
        title: "",
        description: "",
        price: "",
        mainImage: null,
        mainImageUrl: "",
        galleryImages: [],
        galleryImageUrls: [],
        ringSizes: [],
        categories: [],
        tags: [],
        details: "",
      });
      setEditingProductId(null);
      setIsEditing(false);
    }
  }, [editingProduct]);

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | File | File[] | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "gallery"
  ) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      try {
        setIsLoading(true);

        if (type === "main") {
          const file = files[0];
          const uploadResult = await uploadAPI.uploadImage(file);
          handleInputChange("mainImage", file);
          handleInputChange("mainImageUrl", uploadResult.url);
        } else {
          const newFiles = Array.from(files);
          const uploadResults = await uploadAPI.uploadImages(newFiles);

          setFormData((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...newFiles],
            galleryImageUrls: [
              ...prev.galleryImageUrls,
              ...uploadResults.map((r) => r.url),
            ],
          }));
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      galleryImageUrls: prev.galleryImageUrls.filter((_, i) => i !== index),
    }));
  };

  const addRingSize = () => {
    if (
      newRingSize.trim() &&
      !formData.ringSizes.includes(newRingSize.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        ringSizes: [...prev.ringSizes, newRingSize.trim()],
      }));
      setNewRingSize("");
    }
  };

  const removeRingSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      ringSizes: prev.ringSizes.filter((s) => s !== size),
    }));
  };

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !formData.categories.includes(newCategory.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleCategorySelect = (
    category: Category | Subcategory,
    level: number
  ) => {
    const currentCategoryInPath = categorySelectionPath[level];

    let newPath;

    // If the clicked category at the current level is already selected, deselect it and everything after.
    if (currentCategoryInPath?.id === category.id) {
      newPath = categorySelectionPath.slice(0, level);
    } else {
      // Otherwise, select it, replacing any previous selection at this level and after.
      newPath = [...categorySelectionPath.slice(0, level), category];
    }

    setCategorySelectionPath(newPath);

    // Update form data with the names from the new path
    const newCategoryNames = newPath.map((c) => c.name);
    setFormData((prev) => ({
      ...prev,
      categories: newCategoryNames,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert("Please enter a product title");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a product description");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("Please enter a valid price");
      return;
    }
    if (!formData.mainImageUrl) {
      alert("Please upload a main image");
      return;
    }

    try {
      setIsLoading(true);

      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        mainImage: formData.mainImageUrl,
        galleryImages: formData.galleryImageUrls,
        ringSizes: formData.ringSizes,
        categories: formData.categories,
        tags: formData.tags,
        details: formData.details
          .split("\n")
          .filter((line) => line.trim() !== ""),
      };

      if (isEditing && editingProductId) {
        await productAPI.update(editingProductId, productData);
        alert("Product updated successfully!");
      } else {
        await productAPI.create(productData);
        alert("Product created successfully!");
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        mainImage: null,
        mainImageUrl: "",
        galleryImages: [],
        galleryImageUrls: [],
        ringSizes: [],
        categories: [],
        tags: [],
        details: "",
      });
      setIsEditing(false);
      setEditingProductId(null);

      // Call callback to refresh product list
      if (onProductSaved) {
        onProductSaved();
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add/Edit Product</CardTitle>
        <CardDescription>Fill in the product details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Product title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Product description..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Product Details */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Details</label>
            <textarea
              placeholder="Enter product details, one per line..."
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              required
            />
          </div>

          {/* Main Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Main Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {formData.mainImageUrl ? (
                <div className="space-y-2">
                  <Image
                    src={resolveMediaUrl(formData.mainImageUrl)}
                    alt="Main product"
                    width={800}
                    height={320}
                    className="w-full h-32 object-cover rounded-lg mx-auto"
                    unoptimized
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleInputChange("mainImage", null);
                      handleInputChange("mainImageUrl", "");
                    }}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload main image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "main")}
                    className="hidden"
                    id="main-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const fileInput = document.getElementById(
                        "main-image-upload"
                      ) as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                  >
                    Choose Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gallery Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, "gallery")}
                className="hidden"
                id="gallery-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const fileInput = document.getElementById(
                    "gallery-upload"
                  ) as HTMLInputElement;
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Gallery Images
              </Button>

              {formData.galleryImageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {formData.galleryImageUrls.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={resolveMediaUrl(imageUrl)}
                        alt={`Gallery ${index + 1}`}
                        width={400}
                        height={96}
                        className="w-full h-24 object-cover rounded-lg"
                        unoptimized
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ring Sizes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ring Sizes</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add ring size..."
                value={newRingSize}
                onChange={(e) => setNewRingSize(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addRingSize())
                }
              />
              <Button type="button" onClick={addRingSize}>
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {defaultRingSizes.map((size) => (
                <Badge
                  key={size}
                  variant={
                    formData.ringSizes.includes(size) ? "default" : "secondary"
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    if (formData.ringSizes.includes(size)) {
                      removeRingSize(size);
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        ringSizes: [...prev.ringSizes, size],
                      }));
                    }
                  }}
                >
                  {size}
                </Badge>
              ))}
            </div>
            {formData.ringSizes.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Selected sizes:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.ringSizes.map((size) => (
                    <Badge
                      key={size}
                      variant="default"
                      className="cursor-pointer"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeRingSize(size)}
                        className="ml-2 hover:bg-red-600 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categories</label>

            {/* Hierarchical selection */}
            <div className="space-y-4">
              {[
                availableCategories,
                ...categorySelectionPath.map((c) => c.subcategories || []),
              ].map(
                (levelCategories, level) =>
                  levelCategories.length > 0 && (
                    <div
                      key={level}
                      className="space-y-2 p-3 border rounded-md bg-gray-50"
                    >
                      <p className="text-sm font-semibold text-gray-600">
                        {level === 0
                          ? "Select Main Category"
                          : `Select Subcategory for "${
                              categorySelectionPath[level - 1].name
                            }"`}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {levelCategories.map((cat) => (
                          <Badge
                            key={cat.id}
                            variant={
                              categorySelectionPath[level]?.id === cat.id
                                ? "default"
                                : "secondary"
                            }
                            className="cursor-pointer text-base p-2"
                            onClick={() => handleCategorySelect(cat, level)}
                          >
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>

            {/* Selected Categories Path */}
            {formData.categories.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Selected Path:</p>
                <div className="flex flex-wrap items-center gap-2">
                  {formData.categories.map((category, index) => (
                    <React.Fragment key={category}>
                      {index > 0 && <span className="text-gray-400">›</span>}
                      <Badge variant="outline">{category}</Badge>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag}>
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {defaultTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={
                    formData.tags.includes(tag) ? "default" : "secondary"
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    if (formData.tags.includes(tag)) {
                      removeTag(tag);
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        tags: [...prev.tags, tag],
                      }));
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="default"
                      className="cursor-pointer"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:bg-red-600 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Product"
              ) : (
                "Save Product"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  price: "",
                  mainImage: null,
                  mainImageUrl: "",
                  galleryImages: [],
                  galleryImageUrls: [],
                  ringSizes: [],
                  categories: [],
                  tags: [],
                  details: "",
                });
                setIsEditing(false);
                setEditingProductId(null);
              }}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
