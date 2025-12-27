import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testDatabaseConnection() {
    console.log("\n🔄 Testing database connection...\n");

    console.log("📋 Database Configuration:");
    console.log("   Host:", process.env.DB_HOST);
    console.log("   User:", process.env.DB_USER);
    console.log("   Database:", process.env.DB_NAME);
    console.log("   Port:", process.env.DB_PORT || 3306);
    console.log("");

    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
        console.error("❌ Missing database environment variables in .env.local");
        return;
    }

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT || 3306),
            connectTimeout: 10000,
        });

        console.log("✅ Successfully connected to the database!\n");

        // Test query - get database info
        const [dbInfo] = await connection.query("SELECT DATABASE() as db_name, VERSION() as version");
        console.log("📊 Database Info:");
        console.log("   Database:", dbInfo[0].db_name);
        console.log("   MySQL Version:", dbInfo[0].version);
        console.log("");

        // Check tables
        const [tables] = await connection.query("SHOW TABLES");
        console.log("📁 Tables in database:", tables.length);
        if (tables.length > 0) {
            console.log("   Tables:");
            tables.forEach((table) => {
                console.log("   -", Object.values(table)[0]);
            });
        }
        console.log("");

        // Check users table
        const [userCount] = await connection.query("SELECT COUNT(*) as count FROM users");
        console.log("👥 Users in database:", userCount[0].count);

        // Check for admin users
        const [adminUsers] = await connection.query(
            "SELECT id, email, role FROM users WHERE role = 'admin' OR role = 'super_admin'"
        );
        console.log("🔑 Admin users:", adminUsers.length);
        if (adminUsers.length > 0) {
            adminUsers.forEach((user) => {
                console.log(`   - ${user.email} (${user.role})`);
            });
        }
        console.log("");

        await connection.end();
        console.log("✅ Database connection test completed successfully!\n");
    } catch (error) {
        console.error("❌ Database connection failed!");
        console.error("Error:", error.message);
        console.error("\n💡 Possible issues:");
        console.error("   - Check if the database host allows remote connections");
        console.error("   - Verify your IP is whitelisted in Hostinger");
        console.error("   - Confirm database credentials are correct");
        console.error("   - Check if firewall is blocking port 3306\n");
    }
}

testDatabaseConnection();
