import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getJsonColumnType(
  connection: mysql.PoolConnection
): Promise<"JSON" | "TEXT"> {
  try {
    await connection.execute(
      `CREATE TABLE IF NOT EXISTS __json_check (val JSON)`
    );
    await connection.execute(`DROP TABLE IF EXISTS __json_check`);
    return "JSON";
  } catch {
    return "TEXT";
  }
}

async function createTables() {
  const connection = await pool.getConnection();
  try {
    const jsonType = await getJsonColumnType(connection);
    console.log("Checking for 'products' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        mainImage VARCHAR(512) NOT NULL,
        galleryImages ${jsonType} NOT NULL,
        ringSizes ${jsonType} NOT NULL,
        categories ${jsonType} NOT NULL,
        tags ${jsonType} NOT NULL,
        details ${jsonType} NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("'products' table checked/created successfully.");

    console.log("Checking for 'categories' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parentId VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);
    console.log("'categories' table checked/created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    connection.release();
  }
}

// Initialize tables on startup
createTables();

export default pool;
