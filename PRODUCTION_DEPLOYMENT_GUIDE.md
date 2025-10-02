# 🚀 **PRODUCTION DEPLOYMENT GUIDE**

## ⚠️ **CRITICAL: Fix Authentication Before Deploying**

Your live site shows `404` errors because authentication isn't properly configured on production.

---

## 🔧 **Step 1: Fix Environment Variables on VPS**

On your VPS, create/update `.env.production` file:

```bash
# Edit the file
nano /path/to/your/project/.env.production

# Add these CRITICAL variables:
NEXTAUTH_URL=https://mavendiamonds.com
NEXTAUTH_SECRET=your-32-character-secret-key-here

# Generate the secret:
openssl rand -base64 32

# Copy the output and paste it as NEXTAUTH_SECRET value
```

**Current .env.production should have:**

```env
# Database (your existing config)
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=Tsaif565e@!
DB_NAME=melvin_diamonds
DB_PORT=3306

# API (local routes for production)
NEXT_PUBLIC_API_BASE=/api
NEXT_PUBLIC_MEDIA_BASE=

# AUTHENTICATION (ADD THESE!)
NEXTAUTH_URL=https://mavendiamonds.com
NEXTAUTH_SECRET=your-super-secret-key-generate-above

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Disable file fallback
FILE_FALLBACK=false
```

---

## 🔧 **Step 2: Restart Your VPS Services**

```bash
# On VPS terminal:
cd /path/to/your/project

# Install new dependencies
npm install

# Rebuild with new environment
npm run build

# Restart your app
pm2 restart melvin-diamonds  # or your app name

# Check if running
pm2 status
```

---

## 🔧 **Step 3: Test Authentication on Live**

1. Visit: `https://mavendiamonds.com/auth/signin`
2. Try signing in with: `test@example.com` / `password123`
3. Should redirect to dashboard, not 404 error

---

## 🔧 **Step 4: Verify Database Connection**

1. Visit: `https://mavendiamonds.com/api/test-db`
2. Should show: `{"success": true, "usersTableExists": true}`

---

## 🚨 **Common Issues & Fixes:**

### **Issue 1: Still getting 404**

- Check if `.env.production` exists and has correct `NEXTAUTH_SECRET`
- Verify PM2 app is running
- Check PM2 logs: `pm2 logs melvin-diamonds`

### **Issue 2: Database connection fails**

- Check MySQL is running: `sudo systemctl status mysql`
- Verify database exists: `mysql -u root -p melvin_diamonds -e "SELECT 1"`

### **Issue 3: Authentication errors**

- Check NextAuth logs in PM2: `pm2 logs melvin-diamonds | grep -i auth`
- Verify users table has data

---

## ✅ **Once Fixed - Test Complete Flow:**

1. ✅ **Sign up** → Should work
2. ✅ **Sign in** → Should work
3. ✅ **Admin panel** → Should load with data
4. ✅ **Product pages** → Should fetch from live API
5. ✅ **Cart** → Should persist across sessions

---

## 📞 **Need Help?**

If still getting errors after following these steps:

1. Share the PM2 logs: `pm2 logs melvin-diamonds`
2. Check if environment variables are loaded
3. Verify database connectivity

**The authentication system is already built and working locally - we just need to configure it properly on production!** 🎯
