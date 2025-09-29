# 🔧 Setup Environment Variables

## ⚠️ CRITICAL: You must create `.env.local` file manually

The configuration in `next.config.ts` **does not work** for setting environment variables in Next.js. You **MUST** create a `.env.local` file in the root directory.

## 📝 Step-by-Step Instructions

### Step 1: Create `.env.local` file

In the root of your project (same level as `package.json`), create a file named **`.env.local`** with the following content:

```env
# Local Environment Variables for Development

# Live MySQL Database Credentials
DB_HOST=103.118.16.111
DB_USER=root
DB_PASSWORD=Tsaif565e@!
DB_NAME=melvin_diamonds
DB_PORT=3306

# Live API for frontend data fetching
NEXT_PUBLIC_API_BASE=https://mavendiamonds.com/api
NEXT_PUBLIC_MEDIA_BASE=https://mavendiamonds.com

# Disable fallback to local JSON files
FILE_FALLBACK=false
```

### Step 2: Create `.env.production` file (Optional, for VPS)

If you're deploying to VPS, create **`.env.production`** with:

```env
# Production Environment Variables

# MySQL Database Credentials (local on VPS)
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=Tsaif565e@!
DB_NAME=melvin_diamonds
DB_PORT=3306

# Production API endpoints (use local routes)
NEXT_PUBLIC_API_BASE=/api
NEXT_PUBLIC_MEDIA_BASE=

# Disable fallback to local JSON files
FILE_FALLBACK=false
```

### Step 3: Restart Development Server

After creating the `.env.local` file, **STOP** and **RESTART** your development server:

```bash
# Stop the current dev server (Ctrl+C)

# Then restart
pnpm dev
```

### Step 4: Test the Configuration

Visit `http://localhost:3000/test-api` to verify:

- Environment variables are loaded correctly
- APIs are connecting to `https://mavendiamonds.com/api`
- Products and categories are loading

## 🐛 Troubleshooting

### If you still see errors after creating `.env.local`:

1. **Check file name**: Must be exactly `.env.local` (with the dot at the start)
2. **Check file location**: Must be in the root directory, not in `src/` folder
3. **Restart server**: Must restart the dev server after creating/editing env files
4. **Clear cache**: Try deleting `.next` folder and restart
   ```bash
   rmdir /s /q .next
   pnpm dev
   ```

### If APIs still don't work:

1. Check if `https://mavendiamonds.com/api/products` is accessible in your browser
2. Open browser console (F12) and check for CORS errors
3. Verify database credentials are correct

## ✅ Verification

You should see in the browser console or test page:

- `NEXT_PUBLIC_API_BASE: https://mavendiamonds.com/api`
- `NEXT_PUBLIC_MEDIA_BASE: https://mavendiamonds.com`

If you see:

- `NEXT_PUBLIC_API_BASE: /api` - **The `.env.local` file is not loaded!**

## 📄 .gitignore Note

The `.env.local` file should already be in `.gitignore` and will not be committed to git. This is correct behavior for security.
