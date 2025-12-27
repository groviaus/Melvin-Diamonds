import bcrypt from "bcryptjs";

const password = "Admin@123"; // Change this to your desired password

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error("Error generating hash:", err);
        return;
    }

    console.log("\n═══════════════════════════════════════");
    console.log("🔑 Password Hash Generated");
    console.log("═══════════════════════════════════════");
    console.log("Password:", password);
    console.log("Hash:", hash);
    console.log("═══════════════════════════════════════\n");

    console.log("SQL to create admin user:\n");
    console.log(`INSERT INTO users (id, name, email, password, provider, role, emailVerified, createdAt, updatedAt)
VALUES (
    'admin-${Date.now()}',
    'Admin User',
    'admin@mavendiamonds.com',
    '${hash}',
    'credentials',
    'admin',
    NOW(),
    NOW(),
    NOW()
);\n`);
});
