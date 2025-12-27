# 🔒 Secure Database Connection via SSH Tunnel

This is the **recommended and safest way** to connect your local development environment to the live database.

## 🎯 Why SSH Tunnel?

✅ **Secure** - All traffic encrypted through SSH  
✅ **No firewall changes** - MySQL port stays closed to the internet  
✅ **No MySQL config changes** - Database remains secure  
✅ **Professional** - Industry standard practice  

## 📝 How to Use

### **Step 1: Update Your `.env.local` File**

Change the database configuration to:

```env
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=app_user
DB_PASSWORD=Alfazsiddiqui@247
DB_NAME=maven_diamonds
```

**Note:** We changed:
- `DB_HOST` from `62.72.12.146` to `127.0.0.1` (localhost)
- `DB_PORT` from `3306` to `3307` (local tunnel port)

### **Step 2: Start the SSH Tunnel**

Open a **new terminal window** and run:

```bash
./start-db-tunnel.sh
```

Or manually:

```bash
ssh -L 3307:localhost:3306 deploy@62.72.12.146 -N
```

**Keep this terminal window open** while developing. You'll see no output - that's normal!

### **Step 3: Start Your Development Server**

In a **different terminal window**, run:

```bash
pnpm dev
```

### **Step 4: Test the Connection**

```bash
node test-db-connection.mjs
```

You should see a successful connection! ✅

---

## 🔄 Daily Workflow

Every time you want to develop locally:

1. **Terminal 1:** Run `./start-db-tunnel.sh` (keep it running)
2. **Terminal 2:** Run `pnpm dev`
3. Work normally - your app connects to live database securely
4. When done, press `Ctrl+C` in both terminals

---

## 🆚 Comparison: SSH Tunnel vs Direct Connection

| Feature | SSH Tunnel | Direct Connection |
|---------|-----------|-------------------|
| Security | ✅ Encrypted | ⚠️ Exposed port |
| Setup | Easy | Requires firewall changes |
| Maintenance | None | Need to manage IP whitelist |
| Best Practice | ✅ Yes | ❌ No |
| Production Ready | ✅ Yes | ⚠️ Risk |

---

## 🐛 Troubleshooting

**"Connection refused" error:**
- Make sure the SSH tunnel is running
- Check that you updated `.env.local` with the correct settings

**"Port already in use":**
- Another tunnel might be running
- Kill it: `lsof -ti:3307 | xargs kill -9`

**SSH tunnel disconnects:**
- This is normal after inactivity
- Just restart it with `./start-db-tunnel.sh`

---

## 💡 Pro Tip: Auto-reconnect

For a tunnel that auto-reconnects, use:

```bash
while true; do
  ssh -L 3307:localhost:3306 deploy@62.72.12.146 -N
  echo "Tunnel disconnected. Reconnecting in 5 seconds..."
  sleep 5
done
```
