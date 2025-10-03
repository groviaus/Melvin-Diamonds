import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Define more specific types for our data, matching the form component
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

// Re-export the component with a more descriptive name for clarity
export { ProfilePage as default };

async function getUserProfile(userId: string) {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email, image, role FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return null;
    }

    const [addresses] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM addresses WHERE userId = ? ORDER BY isDefault DESC, createdAt DESC",
      [userId]
    );

    return {
      user: users[0] as UserProfile,
      addresses: addresses as Address[],
    };
  } catch (error) {
    console.error("Failed to fetch profile data on server:", error);
    // In a real app, you might want to show an error page
    return null;
  }
}

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  const profileData = await getUserProfile(session.user.id);

  if (!profileData) {
    // This could happen if the user was deleted from the DB but the session is still active
    // Or if the DB connection fails.
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>Could not load your profile data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <ProfileForm user={profileData.user} addresses={profileData.addresses} />
    </div>
  );
};
