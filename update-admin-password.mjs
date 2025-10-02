import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables from .env.production
dotenv.config({ path: ".env.production" });

// --- START OF CONFIGURATION ---

// 1. Set the email of the admin user you want to update.
const adminEmail = "test@example.com";

// 2. Set the NEW password for the admin user.
//    Choose a strong, temporary password.
const newPassword = "newStrongPassword123!";

// --- END OF CONFIGURATION ---

async function updateAdminPassword() {
  console.log("Connecting to the database...");

  if (
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME
  ) {
    console.error("❌ Error: Missing required database environment variables.");
    console.error(
      "Ensure DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME are set in your .env.production file."
    );
    return;
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
  });

  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection successful.");

    console.log(`\nChecking for user with email: ${adminEmail}...`);
    const [rows] = await connection.query(
      "SELECT id, email, password FROM users WHERE email = ? AND provider = 'credentials'",
      [adminEmail]
    );

    const users = rows as any[];
    if (users.length === 0) {
      console.error(`❌ Error: No user found with the email "${adminEmail}".`);
      connection.release();
      return;
    }

    const user = users[0];
    console.log(`✅ User found: { id: ${user.id}, email: ${user.email} }`);

    console.log("\nGenerating secure password hash...");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("✅ Password hash generated.");

    console.log("\nUpdating user password in the database...");
    await connection.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      user.id,
    ]);
    console.log("✅ User password updated successfully.");

    connection.release();
  } catch (error) {
    console.error("❌ An error occurred during the update process:", error);
  } finally {
    await pool.end();
    console.log("\nDatabase connection closed.");
  }
}

updateAdminPassword();
