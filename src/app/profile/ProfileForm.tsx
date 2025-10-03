"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Mail, Shield, Home, Upload, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Define types for the data we expect
interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
}

interface Address {
  id: string;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  zipCode: string;
  phone: string | null;
}

interface ProfileFormProps {
  user: UserProfile;
  addresses: Address[];
}

export function ProfileForm({ user, addresses }: ProfileFormProps) {
  const router = useRouter();
  const updateUser = useUserStore((state) => state.updateUser);
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    let imageUrl = user.image; // Keep the existing image by default

    try {
      // 1. If a new image is selected, upload it first
      if (image) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", image);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Image upload failed");
        }
        imageUrl = uploadResult.url;
        setIsUploading(false);
      }

      // 2. Update the user profile with the name and/or new image URL
      const updateResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl }),
      });

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      // 3. Update the Zustand store in real-time
      updateUser({
        name: updateResult.name,
        image: updateResult.image,
      });

      // 4. Refresh server components on the page
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsUpdating(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateProfile}>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={imagePreview || undefined}
                    alt={user.name || ""}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full h-7 w-7"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload Image</span>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="mr-2 h-4 w-4" />
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={isUpdating}>
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploading
                  ? "Uploading..."
                  : isUpdating
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Saved Addresses Card */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="rounded-md border p-4">
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      {addr.firstName} {addr.lastName}
                    </p>
                    {addr.isDefault && <Badge>Default</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{addr.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    {addr.address}, {addr.apartment}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addr.city}, {addr.state} - {addr.zipCode}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Home className="mx-auto h-12 w-12" />
              <p className="mt-4">You have no saved addresses.</p>
              <p className="text-sm">
                Add an address during checkout to see it here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
