"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FolderIcon,
  SearchIcon,
  DownloadIcon,
  Loader2Icon,
} from "lucide-react";
import CategoryTree from "../components/CategoryTree";
import CategoryForm from "../components/CategoryForm";
import { categoryAPI } from "@/lib/api";
import { CategoryData, Category, Subcategory } from "@/types";

export default function CategoriesPage() {
  const [categoryData, setCategoryData] = useState<CategoryData>({
    categories: [],
  });
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter helpers (stable)
  const filterCategoriesBySearch = useCallback(
    (categories: Category[], term: string): Category[] => {
      const filterSubcategoriesBySearch = (
        subcategory: Subcategory,
        t: string
      ): boolean => {
        const matchesName = subcategory.name.toLowerCase().includes(t);
        const hasMatchingChild =
          subcategory.subcategories?.some((sub) =>
            filterSubcategoriesBySearch(sub, t)
          ) || false;
        return matchesName || hasMatchingChild;
      };

      return categories.filter((category) => {
        const matchesName = category.name.toLowerCase().includes(term);
        const hasMatchingSubcategory = category.subcategories.some((sub) =>
          filterSubcategoriesBySearch(sub, term)
        );
        return matchesName || hasMatchingSubcategory;
      });
    },
    []
  );

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categoryData.categories);
    } else {
      const filtered = filterCategoriesBySearch(
        categoryData.categories,
        searchTerm.toLowerCase()
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categoryData, filterCategoriesBySearch]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryAPI.getAll();
      setCategoryData(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      alert("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  // (old inline filter helpers removed; now using memoized version above)

  const handleAddCategory = async (name: string, parentId?: string) => {
    try {
      setIsActionLoading(true);
      await categoryAPI.create({ name, parentId });
      await fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Failed to add category:", error);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditCategory = async (id: string, name: string) => {
    try {
      setIsActionLoading(true);
      await categoryAPI.update(id, name);
      await fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Failed to update category");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this category? This will also delete all its subcategories."
      )
    ) {
      try {
        setIsActionLoading(true);
        await categoryAPI.delete(id);
        await fetchCategories(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category");
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const handleAddCategoryFromTree = async (parentId?: string) => {
    const name = prompt("Enter category name");
    if (!name || !name.trim()) return;
    await handleAddCategory(name.trim(), parentId);
  };

  const handleExportCategories = () => {
    const dataStr = JSON.stringify(categoryData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `categories-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTotalCategoryCount = (categories: Category[]): number => {
    let count = categories.length;
    for (const category of categories) {
      count += getSubcategoryCount(category.subcategories);
    }
    return count;
  };

  const getSubcategoryCount = (subcategories: Subcategory[]): number => {
    let count = subcategories.length;
    for (const subcategory of subcategories) {
      if (subcategory.subcategories) {
        count += getSubcategoryCount(subcategory.subcategories);
      }
    }
    return count;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories and subcategories
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCategories}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalCategoryCount(categoryData.categories)}
            </div>
            <p className="text-xs text-muted-foreground">
              Including all nested levels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Main Categories
            </CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryData.categories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Top-level categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalCategoryCount(categoryData.categories) -
                categoryData.categories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              All nested categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Tree */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                View and manage your category hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2Icon className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <CategoryTree
                  categories={filteredCategories}
                  onAddCategory={handleAddCategoryFromTree}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              )}
              {isActionLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                    <Loader2Icon className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Category Form */}
        <div className="lg:col-span-1">
          <CategoryForm
            categories={categoryData.categories}
            onAddCategory={handleAddCategory}
            isLoading={isActionLoading}
          />
        </div>
      </div>
    </div>
  );
}
