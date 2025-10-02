import bcrypt from "bcryptjs";

// The password to hash, provided by the user.
const password = "Maven@2025!";

async function hashPassword() {
  try {
    console.log("Generating secure password hash for:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("\n--- COPY THE HASH BELOW ---");
    console.log(hashedPassword);
    console.log("--- END OF HASH ---\n");
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

hashPassword();
