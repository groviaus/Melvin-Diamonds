-- Enhanced Order Items Table Schema
-- This adds missing product details to order_items table

-- Add new columns to existing order_items table
ALTER TABLE order_items 
ADD COLUMN productCategories JSON,
ADD COLUMN productTags JSON,
ADD COLUMN productDetails JSON,
ADD COLUMN productGalleryImages JSON,
ADD COLUMN productRingSizes JSON,
ADD COLUMN productPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Original product price at time of order',
ADD COLUMN productMainImage VARCHAR(512) COMMENT 'Main product image at time of order';

-- Update existing records to have default values
UPDATE order_items 
SET 
  productCategories = JSON_ARRAY(),
  productTags = JSON_ARRAY(),
  productDetails = JSON_ARRAY(),
  productGalleryImages = JSON_ARRAY(),
  productRingSizes = JSON_ARRAY(),
  productPrice = price
WHERE productCategories IS NULL;

-- Create new enhanced order_items table (alternative approach)
CREATE TABLE IF NOT EXISTS order_items_enhanced (
  id VARCHAR(255) PRIMARY KEY,
  orderId VARCHAR(255) NOT NULL,
  productId VARCHAR(255) NOT NULL,
  
  -- Basic Product Info
  productTitle VARCHAR(255) NOT NULL,
  productDescription TEXT,
  productMainImage VARCHAR(512),
  productGalleryImages JSON,
  
  -- Product Categories & Classification
  productCategories JSON,
  productTags JSON,
  productDetails JSON,
  
  -- Ring-specific Info
  productRingSizes JSON,
  selectedRingSize VARCHAR(50),
  
  -- Pricing (frozen at time of order)
  productPrice DECIMAL(10, 2) NOT NULL,
  orderPrice DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id (orderId),
  INDEX idx_product_id (productId),
  INDEX idx_categories (productCategories),
  INDEX idx_tags (productTags)
);
