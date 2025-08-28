"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, Loader2Icon } from "lucide-react";
import { Category, Subcategory } from "@/app/api/categories/route";

interface CategoryFormProps {
  categories: Category[];
  onAddCategory: (name: string, parentId?: string) => Promise<void>;
  isLoading: boolean;
}

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

export default function CategoryForm({
  categories,
  onAddCategory,
  isLoading,
}: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  const flatOptions = flattenCategories(categories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      await onAddCategory(categoryName.trim(), selectedParentId || undefined);
      setCategoryName("");
      setSelectedParentId("");
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const getIndentedName = (option: CategoryOption) => {
    const indent = "  ".repeat(option.level);
    return `${indent}${option.name}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
        <CardDescription>
          Create a new category or add a subcategory to an existing one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <Input
              placeholder="Enter category name..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          {/* Parent Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Parent Category (Optional)
            </label>
            <select
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Create as Main Category --</option>
              {flatOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {getIndentedName(option)}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Leave empty to create a main category, or select a parent to
              create a subcategory
            </p>
          </div>

          {/* Preview */}
          {categoryName.trim() && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="flex items-center space-x-2">
                {selectedParentId && (
                  <>
                    <span className="text-sm text-gray-600">
                      {
                        flatOptions.find((opt) => opt.id === selectedParentId)
                          ?.name
                      }
                    </span>
                    <span className="text-gray-400">→</span>
                  </>
                )}
                <Badge variant="outline">{categoryName.trim()}</Badge>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Category
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}



