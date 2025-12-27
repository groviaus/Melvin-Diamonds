# Image Preview Fix - Complete Solution

## Problem Summary
On the `/admin/product` page, uploaded images showed as broken icons instead of displaying the actual images.

## Root Cause

The issue had **two parts**:

### Part 1: Where Files Are Uploaded
- Your frontend runs locally at `http://localhost:3001`
- But your API points to a remote server: `NEXT_PUBLIC_API_BASE=http://62.72.12.146:3000/api`
- When you upload an image, it goes to the **remote server**, not your local machine

### Part 2: How Next.js Serves Static Files
- The upload API saved files to `public/uploads/` on the remote server
- The API returned a URL like `/uploads/filename.jpg`
- **Critical Issue**: Next.js in production does NOT automatically serve files added to `public/` after deployment
- When the browser tried to access `http://62.72.12.146:3000/uploads/filename.jpg`, it got a 404 error

## The Solution

Created a **Next.js API route** to serve uploaded images dynamically:

### 1. New API Route: `/api/uploads/[filename]/route.ts`
- Reads files from the `public/uploads/` directory
- Serves them with proper content-type headers
- Includes caching headers for performance
- Validates filenames to prevent security issues

### 2. Updated Upload API: `/api/upload/route.ts`
- Changed the returned URL from `/uploads/filename.jpg` to `/api/uploads/filename.jpg`
- Now images are served through the API route instead of static file serving

### 3. Updated URL Resolution: `src/lib/utils.ts`
- Modified `resolveMediaUrl()` to handle `/api/` paths correctly
- For paths starting with `/api/`, uses the full API base URL
- For other paths, uses the media base URL

## How It Works Now

**Upload Flow:**
1. User selects image in `/admin/product` page
2. Image is uploaded to remote server at `http://62.72.12.146:3000/api/upload`
3. File is saved to `public/uploads/` on remote server
4. API returns: `{ "url": "/api/uploads/1234567890-abc.jpg" }`

**Preview Flow:**
1. `resolveMediaUrl()` converts `/api/uploads/1234567890-abc.jpg`
2. To: `http://62.72.12.146:3000/api/uploads/1234567890-abc.jpg`
3. Browser requests this URL
4. Next.js API route reads the file and serves it
5. Image displays correctly! ✅

## Files Changed

1. **Created**: `src/app/api/uploads/[filename]/route.ts`
   - New API route to serve uploaded images

2. **Modified**: `src/app/api/upload/route.ts`
   - Changed URL format from `/uploads/` to `/api/uploads/`

3. **Modified**: `src/lib/utils.ts`
   - Updated `resolveMediaUrl()` to handle API routes correctly

4. **Modified**: `next.config.ts`
   - Added remote patterns for localhost and remote server

## Testing

To test the fix:

1. **Restart your dev server** (the changes require a restart)
2. Navigate to `http://localhost:3001/admin/product`
3. Upload a main image - preview should display correctly
4. Upload gallery images - previews should display correctly

## Verification Commands

Test upload API:
```bash
# Create a test image
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test.png

# Upload to remote server
curl -X POST http://62.72.12.146:3000/api/upload -F "file=@/tmp/test.png"

# Should return something like:
# {"success":true,"filename":"1234567890-abc.png","url":"/api/uploads/1234567890-abc.png",...}

# Test if image is accessible
curl -I http://62.72.12.146:3000/api/uploads/1234567890-abc.png

# Should return HTTP 200 with Content-Type: image/png
```

## Environment Variables
Your current `.env.local`:
```
NEXT_PUBLIC_API_BASE=http://62.72.12.146:3000/api
NEXT_PUBLIC_MEDIA_BASE=http://62.72.12.146:3000/
```

These are correct and don't need to be changed.

## Important Notes

1. **Server Permissions**: Make sure the remote server has write permissions to the `public/uploads/` directory
2. **Deployment**: When you deploy to the remote server, make sure to copy these new files
3. **Alternative Solution**: For better performance in production, consider using nginx to serve the `/uploads` directory directly instead of going through Next.js

## Next Steps

After deploying these changes to your remote server:
1. The image preview will work correctly in development
2. The image preview will work correctly in production
3. All uploaded images will be accessible via the `/api/uploads/` route
