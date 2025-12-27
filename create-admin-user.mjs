import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// --- START OF CONFIGURATION ---

// 1. Set the admin user details
const adminName = "Admin User";
const adminEmail = "admin@mavendiamonds.com";
const adminPassword = "Admin@123"; // Change this to a strong password

// --- END OF CONFIGURATION ---

async function createAdminUser() {
    console.log("🔄 Connecting to the database...");

    if (
        !process.env.DB_HOST ||
        !process.env.DB_USER ||
        !process.env.DB_PASSWORD ||
        !process.env.DB_NAME
    ) {
        console.error("❌ Error: Missing required database environment variables.");
        console.error(
            "Ensure DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME are set in your .env.local file."
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
        console.log("✅ Database connection successful.\n");

        // Check if user already exists
        console.log(`🔍 Checking if user with email "${adminEmail}" already exists...`);
        const [existingUsers] = await connection.query(
            "SELECT id, email, role FROM users WHERE email = ?",
            [adminEmail]
        );

        if ((existingUsers as any[]).length > 0) {
            const existingUser = (existingUsers as any[])[0];
            console.log(`⚠️  User already exists: { id: ${existingUser.id}, email: ${existingUser.email}, role: ${existingUser.role} }`);

            // Update to admin role if not already
            if (existingUser.role !== 'admin') {
                console.log("\n🔄 Updating user role to 'admin'...");
                await connection.query(
                    "UPDATE users SET role = 'admin' WHERE id = ?",
                    [existingUser.id]
                );
                console.log("✅ User role updated to 'admin'.");
            }

            // Update password
            console.log("\n🔄 Updating password...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await connection.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [hashedPassword, existingUser.id]
            );
            console.log("✅ Password updated successfully.");

            console.log("\n✅ Admin user updated successfully!");
            console.log("📧 Email:", adminEmail);
            console.log("🔑 Password:", adminPassword);
            console.log("\n⚠️  Please change this password after your first login!");

            connection.release();
            return;
        }

        // Create new admin user
        console.log("✅ No existing user found. Creating new admin user...\n");

        const userId = `admin-${Date.now()}`;
        console.log("🔄 Generating secure password hash...");
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        console.log("✅ Password hash generated.\n");

        console.log("🔄 Inserting new admin user into database...");
        await connection.query(
            `INSERT INTO users (id, name, email, password, provider, role, emailVerified) 
       VALUES (?, ?, ?, ?, 'credentials', 'admin', NOW())`,
            [userId, adminName, adminEmail, hashedPassword]
        );

        console.log("✅ Admin user created successfully!\n");
        console.log("═══════════════════════════════════════");
        console.log("📝 Admin Credentials:");
        console.log("═══════════════════════════════════════");
        console.log("📧 Email:", adminEmail);
        console.log("🔑 Password:", adminPassword);
        console.log("👤 Role: admin");
        console.log("═══════════════════════════════════════");
        console.log("\n⚠️  IMPORTANT: Please change this password after your first login!");
        console.log("🌐 Login at: http://localhost:3000/auth/signin\n");

        connection.release();
    } catch (error) {
        console.error("❌ An error occurred:", error);
    } finally {
        await pool.end();
        console.log("🔌 Database connection closed.\n");
    }
}

createAdminUser();
