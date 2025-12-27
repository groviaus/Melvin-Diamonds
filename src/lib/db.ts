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

    console.log("Checking for 'users' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        emailVerified TIMESTAMP NULL,
        password VARCHAR(255),
        image VARCHAR(512),
        provider VARCHAR(50) DEFAULT 'credentials',
        role VARCHAR(50) DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("'users' table checked/created successfully.");

    console.log("Checking for 'sessions' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        sessionToken VARCHAR(255) UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_session_token (sessionToken),
        INDEX idx_user_id (userId)
      )
    `);
    console.log("'sessions' table checked/created successfully.");

    console.log("Checking for 'accounts' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        providerAccountId VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INT,
        token_type VARCHAR(50),
        scope VARCHAR(255),
        id_token TEXT,
        session_state VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_provider_account (provider, providerAccountId),
        INDEX idx_user_id (userId)
      )
    `);
    console.log("'accounts' table checked/created successfully.");

    console.log("Checking for 'verification_tokens' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `);
    console.log("'verification_tokens' table checked/created successfully.");

    console.log("Checking for 'addresses' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS addresses (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        isDefault BOOLEAN DEFAULT FALSE,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address VARCHAR(255) NOT NULL,
        apartment VARCHAR(100),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zipCode VARCHAR(20) NOT NULL,
        country VARCHAR(100) DEFAULT 'India',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (userId),
        INDEX idx_default (userId, isDefault)
      )
    `);
    console.log("'addresses' table checked/created successfully.");

    console.log("Checking for 'cart_items' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        productId VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(512),
        size VARCHAR(50),
        quantity INT NOT NULL DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_item (userId, productId, size),
        INDEX idx_user_id (userId)
      )
    `);
    console.log("'cart_items' table checked/created successfully.");

    console.log("Checking for 'orders' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        orderNumber VARCHAR(50) UNIQUE NOT NULL,
        customerName VARCHAR(255) NOT NULL,
        customerEmail VARCHAR(255) NOT NULL,
        customerPhone VARCHAR(20),
        shippingFirstName VARCHAR(100) NOT NULL,
        shippingLastName VARCHAR(100) NOT NULL,
        shippingAddress VARCHAR(255) NOT NULL,
        shippingApartment VARCHAR(100),
        shippingCity VARCHAR(100) NOT NULL,
        shippingState VARCHAR(100) NOT NULL,
        shippingZipCode VARCHAR(20) NOT NULL,
        shippingCountry VARCHAR(100) DEFAULT 'India',
        billingSameAsShipping BOOLEAN DEFAULT TRUE,
        billingFirstName VARCHAR(100),
        billingLastName VARCHAR(100),
        billingAddress VARCHAR(255),
        billingApartment VARCHAR(100),
        billingCity VARCHAR(100),
        billingState VARCHAR(100),
        billingZipCode VARCHAR(20),
        billingCountry VARCHAR(100),
        subtotal DECIMAL(10, 2) NOT NULL,
        shippingCost DECIMAL(10, 2) DEFAULT 0,
        tax DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        paymentMethod VARCHAR(50) NOT NULL,
        paymentStatus VARCHAR(50) DEFAULT 'pending',
        transactionId VARCHAR(255),
        razorpayOrderId VARCHAR(255),
        razorpaySignature VARCHAR(512),
        paymentDetails ${jsonType},
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (userId),
        INDEX idx_order_number (orderNumber),
        INDEX idx_status (status),
        INDEX idx_created_at (createdAt)
      )
    `);
    console.log("'orders' table checked/created successfully.");

    console.log("Checking for 'order_items' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(255) PRIMARY KEY,
        orderId VARCHAR(255) NOT NULL,
        productId VARCHAR(255) NOT NULL,
        productTitle VARCHAR(255) NOT NULL,
        productImage VARCHAR(512),
        productDescription TEXT,
        productCategories ${jsonType},
        productTags ${jsonType},
        productDetails ${jsonType},
        productGalleryImages ${jsonType},
        productRingSizes ${jsonType},
        productPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        size VARCHAR(50),
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
        INDEX idx_order_id (orderId),
        INDEX idx_product_id (productId)
      )
    `);
    console.log("'order_items' table checked/created successfully.");
    
    // Add missing columns to existing table if they don't exist
    try {
      const [columns] = await connection.execute<mysql.RowDataPacket[]>(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'order_items' 
         AND COLUMN_NAME IN ('productCategories', 'productTags', 'productDetails', 'productGalleryImages', 'productRingSizes', 'productPrice')`
      );
      const existingColumns = columns.map((row: any) => row.COLUMN_NAME);
      
      const columnsToAdd = [];
      if (!existingColumns.includes('productCategories')) {
        columnsToAdd.push(`ADD COLUMN productCategories ${jsonType}`);
      }
      if (!existingColumns.includes('productTags')) {
        columnsToAdd.push(`ADD COLUMN productTags ${jsonType}`);
      }
      if (!existingColumns.includes('productDetails')) {
        columnsToAdd.push(`ADD COLUMN productDetails ${jsonType}`);
      }
      if (!existingColumns.includes('productGalleryImages')) {
        columnsToAdd.push(`ADD COLUMN productGalleryImages ${jsonType}`);
      }
      if (!existingColumns.includes('productRingSizes')) {
        columnsToAdd.push(`ADD COLUMN productRingSizes ${jsonType}`);
      }
      if (!existingColumns.includes('productPrice')) {
        columnsToAdd.push(`ADD COLUMN productPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00`);
      }
      
      if (columnsToAdd.length > 0) {
        await connection.execute(`
          ALTER TABLE order_items 
          ${columnsToAdd.join(', ')}
        `);
        console.log(`Added ${columnsToAdd.length} missing columns to 'order_items' table.`);
      }
    } catch (error: any) {
      console.warn("Warning adding columns to order_items:", error.message);
    }

    console.log("Checking for 'order_status_history' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        id VARCHAR(255) PRIMARY KEY,
        orderId VARCHAR(255) NOT NULL,
        oldStatus VARCHAR(50),
        newStatus VARCHAR(50) NOT NULL,
        comment TEXT,
        changedBy VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_id (orderId),
        INDEX idx_created_at (createdAt)
      )
    `);
    console.log("'order_status_history' table checked/created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    connection.release();
  }
}

// Initialize tables on startup
createTables();

export default pool;
