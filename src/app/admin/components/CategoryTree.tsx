"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { Category, Subcategory } from "@/types";

interface CategoryTreeProps {
  categories: Category[];
  onAddCategory: (parentId?: string) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

interface CategoryItemProps {
  item: Category | Subcategory;
  level: number;
  onAddSubcategory: (parentId: string) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

function CategoryItem({
  item,
  level,
  onAddSubcategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);

  const hasSubcategories = item.subcategories && item.subcategories.length > 0;
  const paddingLeft = level * 24;

  const handleSaveEdit = () => {
    if (editName.trim() && editName.trim() !== item.name) {
      onEditCategory(item.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(item.name);
    setIsEditing(false);
  };

  return (
    <div className="border-l-2 border-gray-100">
      <div
        className="flex items-center justify-between p-3 hover:bg-gray-50 border-b"
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
      >
        <div className="flex items-center space-x-2 flex-1">
          {hasSubcategories && (
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </Button>
          )}
          {!hasSubcategories && <div className="w-6" />}

          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-8"
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                autoFocus
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleSaveEdit}
              >
                <CheckIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleCancelEdit}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 flex-1">
              <span className="font-medium">{item.name}</span>
              {hasSubcategories && (
                <Badge variant="secondary" className="text-xs">
                  {item.subcategories!.length}
                </Badge>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onAddSubcategory(item.id)}
              title="Add subcategory"
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsEditing(true)}
              title="Edit category"
            >
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={() => onDeleteCategory(item.id)}
              title="Delete category"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {hasSubcategories && isExpanded && (
        <div>
          {item.subcategories!.map((subcategory) => (
            <CategoryItem
              key={subcategory.id}
              item={subcategory}
              level={level + 1}
              onAddSubcategory={onAddSubcategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryTreeProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Category Structure</h3>
        <Button onClick={() => onAddCategory()}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Main Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No categories yet. Create your first category!
        </div>
      ) : (
        <div className="border rounded-lg bg-white">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              item={category}
              level={0}
              onAddSubcategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
