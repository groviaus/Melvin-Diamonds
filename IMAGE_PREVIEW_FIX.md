# Image Preview Fix - Root Cause Analysis

## Problem
On the `/admin/product` page, when uploading main images or gallery images, the preview showed broken images instead of the actual uploaded files.

## Root Cause

The issue occurred due to a mismatch between where files are uploaded and where the application tries to load them from:

1. **File Upload Location**: When you upload an image locally, it's saved to your local filesystem at `public/uploads/` on your development machine (localhost:3001)

2. **URL Generation**: The upload API returns a relative URL like `/uploads/1234567890-abc.jpg`

3. **URL Resolution Problem**: The `resolveMediaUrl()` function was configured to always prepend `NEXT_PUBLIC_MEDIA_BASE` (which is `http://62.72.12.146:3000/`) to relative URLs

4. **Image Load Failure**: The browser tried to load `http://62.72.12.146:3000/uploads/1234567890-abc.jpg`, but this file only exists on your local machine at `http://localhost:3001/uploads/1234567890-abc.jpg`

## The Fix

### 1. Updated `src/lib/utils.ts` - `resolveMediaUrl()` function
- Added detection for development environment (localhost or 127.0.0.1)
- For `/uploads/` paths in development mode, use `window.location.origin` instead of the remote `NEXT_PUBLIC_MEDIA_BASE`
- This ensures locally uploaded files are loaded from the local server

### 2. Updated `next.config.ts` - Image Remote Patterns
- Added localhost, 127.0.0.1, and 62.72.12.146 to the `remotePatterns` configuration
- This allows Next.js Image component to load images from these sources

## How It Works Now

**Development Mode (localhost:3001):**
- Upload image → Saved to local `public/uploads/`
- Preview URL → `http://localhost:3001/uploads/filename.jpg` ✅
- Image loads successfully from local server

**Production Mode:**
- Existing images from database → Use `NEXT_PUBLIC_MEDIA_BASE` (http://62.72.12.146:3000/)
- Images load from the production server ✅

## Testing
1. Restart your Next.js development server
2. Navigate to `/admin/product`
3. Upload a main image - preview should now display correctly
4. Upload gallery images - previews should now display correctly

## Environment Variables Reference
From your `.env.local`:
```
NEXT_PUBLIC_API_BASE=http://62.72.12.146:3000/api
NEXT_PUBLIC_MEDIA_BASE=http://62.72.12.146:3000/
```

These are still used for loading existing images from the production database, but new uploads in development will use the local server.
