# 🐛 Debugging Steps for Admin Products Page

## ✅ Changes Made

I've updated `src/lib/api.ts` with:

1. **Better error logging** - Console logs now show exactly what's happening
2. **Removed incorrect CORS headers** - Client-side CORS headers don't work
3. **Added `cache: 'no-store'`** - Prevents caching issues with live API data
4. **Detailed error messages** - Shows status codes and error responses

## 🔍 Next Steps to Debug

### Step 1: Open Browser Console

1. Go to `http://localhost:3000/admin/products`
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Look for these messages:

#### Expected Console Output (Success):

```
Fetching products from: https://mavendiamonds.com/api/products
Products fetched successfully: 1
Fetching categories from: https://mavendiamonds.com/api/categories
Categories fetched successfully: 3
```

#### If You See CORS Error:

```
Access to fetch at 'https://mavendiamonds.com/api/products' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solution**: The live API server (`mavendiamonds.com`) needs to allow requests from `localhost:3000`. You need to add CORS headers on your VPS server.

### Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Look for requests to `mavendiamonds.com/api/products` and `/categories`
4. Click on each request and check:
   - **Status**: Should be 200
   - **Response**: Should have data
   - **Headers**: Check if CORS headers are present

### Step 3: If It's a CORS Issue

CORS must be configured on your **VPS server** where `mavendiamonds.com` is hosted.

You need to add these headers to your API responses:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🔧 How to Fix CORS on VPS

### Option 1: Update Next.js API Routes on VPS

The CORS headers in `next.config.ts` only apply to `/api/*` routes served by your Next.js app. They don't affect external API calls.

Since your VPS is running the same Next.js app, the CORS headers should already be configured. But they might not be working correctly.

### Option 2: Temporary Workaround - Use VPS as Proxy

Instead of calling `https://mavendiamonds.com/api` directly from the browser, you could:

1. Keep `NEXT_PUBLIC_API_BASE=/api` (local routes)
2. Modify local API routes to proxy to the live database

This way, the API calls go through your local Next.js server, which then connects to the live database.

## 📝 Tell Me What You See

Please check the browser console and tell me:

1. **What console messages do you see?**

   - Are there "Fetching products from..." messages?
   - Are there any error messages?
   - What do they say?

2. **What's in the Network tab?**

   - Status code for `/products` request?
   - Status code for `/categories` request?
   - Any CORS errors?

3. **What error alert do you get?**
   - "Failed to load categories. Please try again."
   - Any other error messages?

Based on what you see, I can provide the exact solution!
