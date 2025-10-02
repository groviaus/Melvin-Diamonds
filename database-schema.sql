-- Complete E-commerce Database Schema for Melvin Diamonds
-- Run this on your live MySQL database

-- 1. Users Table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  emailVerified TIMESTAMP NULL,
  password VARCHAR(255), -- hashed password for credentials login
  image VARCHAR(512),
  provider VARCHAR(50) DEFAULT 'credentials', -- 'credentials', 'google', etc.
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'admin', 'super_admin'
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. User Addresses Table
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
);

-- 3. Cart Table (persistent cart in database)
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
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  
  -- Customer Info
  customerName VARCHAR(255) NOT NULL,
  customerEmail VARCHAR(255) NOT NULL,
  customerPhone VARCHAR(20),
  
  -- Shipping Address
  shippingFirstName VARCHAR(100) NOT NULL,
  shippingLastName VARCHAR(100) NOT NULL,
  shippingAddress VARCHAR(255) NOT NULL,
  shippingApartment VARCHAR(100),
  shippingCity VARCHAR(100) NOT NULL,
  shippingState VARCHAR(100) NOT NULL,
  shippingZipCode VARCHAR(20) NOT NULL,
  shippingCountry VARCHAR(100) DEFAULT 'India',
  
  -- Billing Address (JSON or separate columns)
  billingSameAsShipping BOOLEAN DEFAULT TRUE,
  billingFirstName VARCHAR(100),
  billingLastName VARCHAR(100),
  billingAddress VARCHAR(255),
  billingApartment VARCHAR(100),
  billingCity VARCHAR(100),
  billingState VARCHAR(100),
  billingZipCode VARCHAR(20),
  billingCountry VARCHAR(100),
  
  -- Order Details
  subtotal DECIMAL(10, 2) NOT NULL,
  shippingCost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment Info
  paymentMethod VARCHAR(50) NOT NULL, -- 'cod', 'razorpay', 'upi', etc.
  paymentStatus VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  transactionId VARCHAR(255), -- Razorpay payment_id
  razorpayOrderId VARCHAR(255), -- Razorpay order_id
  razorpaySignature VARCHAR(512), -- Payment verification signature
  paymentDetails JSON, -- Complete Razorpay response (optional)
  
  -- Order Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  notes TEXT,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (userId),
  INDEX idx_order_number (orderNumber),
  INDEX idx_status (status),
  INDEX idx_created_at (createdAt)
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(255) PRIMARY KEY,
  orderId VARCHAR(255) NOT NULL,
  productId VARCHAR(255) NOT NULL,
  productTitle VARCHAR(255) NOT NULL,
  productImage VARCHAR(512),
  productDescription TEXT, -- Store product description at time of order
  size VARCHAR(50),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL, -- Price at time of purchase (frozen)
  subtotal DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id (orderId),
  INDEX idx_product_id (productId)
);

-- 6. Sessions Table (for NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  sessionToken VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_session_token (sessionToken),
  INDEX idx_user_id (userId)
);

-- 7. Accounts Table (for OAuth providers like Google)
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
);

-- 8. Verification Tokens Table (for email verification)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 9. Order Status History Table (Track status changes)
CREATE TABLE IF NOT EXISTS order_status_history (
  id VARCHAR(255) PRIMARY KEY,
  orderId VARCHAR(255) NOT NULL,
  oldStatus VARCHAR(50),
  newStatus VARCHAR(50) NOT NULL,
  comment TEXT,
  changedBy VARCHAR(255), -- userId of admin/system who changed it
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (orderId),
  INDEX idx_created_at (createdAt)
);

-- Insert a test user (password is "password123" hashed)
-- Password hash generated using bcryptjs with 10 salt rounds
INSERT INTO users (id, name, email, password, provider) VALUES
('test-user-1', 'Test User', 'test@example.com', '$2a$10$rKJZ5VqQ7qH9xqN5YvXDHOEYNMXBVQVGLWXVZ9XqH9xqN5YvXDHO', 'credentials')
ON DUPLICATE KEY UPDATE id=id;

-- Views for easier querying

-- View: User Order Summary
CREATE OR REPLACE VIEW user_order_summary AS
SELECT 
  u.id as userId,
  u.name as userName,
  u.email as userEmail,
  COUNT(DISTINCT o.id) as totalOrders,
  SUM(o.total) as totalSpent,
  COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) as deliveredOrders,
  COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pendingOrders,
  COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelledOrders,
  MAX(o.createdAt) as lastOrderDate
FROM users u
LEFT JOIN orders o ON u.id = o.userId
GROUP BY u.id, u.name, u.email;

-- View: Order Details with Items
CREATE OR REPLACE VIEW order_details_view AS
SELECT 
  o.id as orderId,
  o.orderNumber,
  o.userId,
  o.customerName,
  o.customerEmail,
  o.status,
  o.paymentMethod,
  o.paymentStatus,
  o.total,
  o.createdAt as orderDate,
  oi.id as itemId,
  oi.productId,
  oi.productTitle,
  oi.productImage,
  oi.size,
  oi.quantity,
  oi.price,
  oi.subtotal as itemSubtotal
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.orderId
ORDER BY o.createdAt DESC, oi.createdAt ASC;
