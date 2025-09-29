# Local Development Setup with Live APIs

This document explains how to configure the Melvin Diamonds e-commerce project to use live APIs during local development.

## Configuration Overview

The project has been configured to automatically use live APIs when running in development mode (`npm run dev`). This allows you to:

- View live products and categories on the frontend
- Perform CRUD operations through the admin panel
- See real data from the production database

## Environment Configuration

The configuration is handled in `next.config.ts` with the following settings:

### Development Mode (Local)

- **Database**: Live MySQL database at `103.118.16.111`
- **API Base**: `https://mavendiamonds.com/api`
- **Media Base**: `https://mavendiamonds.com`
- **File Fallback**: Disabled (uses live data only)

### Production Mode (VPS)

- **Database**: Local MySQL database at `127.0.0.1`
- **API Base**: `/api` (local API routes)
- **Media Base**: Empty (local media)
- **File Fallback**: Disabled

## Key Changes Made

### 1. Next.js Configuration (`next.config.ts`)

```typescript
env: {
  // Live database credentials for local development
  DB_HOST: process.env.NODE_ENV === 'development' ? '103.118.16.111' : '127.0.0.1',
  DB_USER: 'root',
  DB_PASSWORD: 'Tsaif565e@!',
  DB_NAME: 'melvin_diamonds',
  DB_PORT: '3306',

  // Live API endpoints for local development
  NEXT_PUBLIC_API_BASE: process.env.NODE_ENV === 'development' ? 'https://mavendiamonds.com/api' : '/api',
  NEXT_PUBLIC_MEDIA_BASE: process.env.NODE_ENV === 'development' ? 'https://mavendiamonds.com' : '',

  // Disable fallback to local JSON files
  FILE_FALLBACK: 'false',
}
```

### 2. API Client (`src/lib/api.ts`)

- Added CORS headers for external API calls
- Updated all fetch requests to use proper headers
- Configured to work with both local and external APIs

### 3. Image Configuration

- Added `opkhandelwal.com` to allowed remote patterns
- Updated media URL resolution to work with live server

## How It Works

1. **Automatic Detection**: The system automatically detects if it's running in development mode
2. **Live Database**: In development, it connects to the live MySQL database
3. **Live APIs**: Frontend components fetch data from the live API endpoints
4. **Media Resolution**: Images are properly resolved from the live server

## Testing the Configuration

Run the test script to verify everything is working:

```bash
node test-api.js
```

This will test both the products and categories APIs and show you the response.

## Running the Application

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Start development server**:

   ```bash
   pnpm dev
   ```

3. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`

## What You'll See

- **Home Page**: Live products and categories from the production database
- **Products Page**: All live products with real data
- **Admin Panel**: Full CRUD operations on live data
- **Categories**: Live category management

## Troubleshooting

### If you see empty data:

1. Check if the live API is accessible: `https://mavendiamonds.com/api/products`
2. Verify database connection in the console logs
3. Check if CORS is properly configured on the live server

### If images don't load:

1. Verify the media base URL is correct
2. Check if images exist on the live server
3. Ensure the domain is added to Next.js image domains

### If admin operations fail:

1. Check database permissions
2. Verify the live API endpoints support the operations
3. Check console for error messages

## Security Notes

- Database credentials are hardcoded for development convenience
- In production, use environment variables for sensitive data
- The live database is accessible from your local machine
- Consider using a separate development database for better security

## Reverting to Local Data

If you want to use local JSON files instead of live data:

1. Set `FILE_FALLBACK: 'true'` in `next.config.ts`
2. Set `NEXT_PUBLIC_API_BASE: '/api'` for development
3. Restart the development server

This configuration allows you to work with live data while developing locally, making it easier to test features and see real content.
