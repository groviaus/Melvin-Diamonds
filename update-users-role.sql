-- Update existing users table to add role column and set admin users
-- Run this on your live MySQL database

-- 1. Add role column to users table (if not exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- 2. Set some users as admin (you can change these emails)
-- Replace these emails with your actual admin emails
UPDATE users SET role = 'admin' WHERE email IN (
  'admin@mavendiamonds.com',
  'your-email@example.com',
  'test@example.com'
);

-- 3. Verify the changes
SELECT id, email, role, provider FROM users ORDER BY createdAt DESC LIMIT 10;

-- 4. Count by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;
