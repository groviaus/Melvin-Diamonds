import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkAdminUser() {
    console.log("\n🔍 Checking admin user in database...\n");

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT || 3306),
            connectTimeout: 10000,
        });

        console.log("✅ Connected to database\n");

        // Check if user exists
        const [users] = await connection.query(
            "SELECT id, name, email, password, provider, role FROM users WHERE email = ?",
            ["admin@mavendiamonds.com"]
        );

        if (users.length === 0) {
            console.log("❌ No user found with email: admin@mavendiamonds.com");
            await connection.end();
            return;
        }

        const user = users[0];
        console.log("📋 User Details:");
        console.log("   ID:", user.id);
        console.log("   Name:", user.name);
        console.log("   Email:", user.email);
        console.log("   Provider:", user.provider);
        console.log("   Role:", user.role);
        console.log("   Password Hash:", user.password ? user.password.substring(0, 20) + "..." : "NULL");
        console.log("");

        // Test password
        if (!user.password) {
            console.log("❌ User has no password set!");
            await connection.end();
            return;
        }

        const testPassword = "Admin@123";
        const isMatch = await bcrypt.compare(testPassword, user.password);

        if (isMatch) {
            console.log("✅ Password 'Admin@123' matches! Login should work.");
        } else {
            console.log("❌ Password 'Admin@123' does NOT match!");
            console.log("\n💡 The password hash in the database doesn't match 'Admin@123'");
            console.log("   This means the password was changed or corrupted.");
        }

        await connection.end();
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

checkAdminUser();
