# 🚀 Portfolio Development Scripts

Quick and easy scripts to run your development servers!

## ⭐ Quick Start (Just Double-Click!)

### `start-dev.bat` - Start Everything

**The easiest way!** Just double-click this file in Windows Explorer.

It will automatically:
- ✅ Open Backend server in a separate window (Port 8080)
- ✅ Open Frontend server in a separate window (Port 3000)
- ✅ Both run in the background - you can minimize or keep working!

**Access your apps:**
- 🔥 Backend API: http://localhost:8080
- ⚡ Frontend: http://localhost:3000
- 🕸️ Mindscape: http://localhost:3000/mindscape

---

## Individual Scripts

### `start-backend.bat` - Backend Only
Starts just the Express API server.

**Usage:** Double-click or run in terminal
```cmd
start-backend.bat
```

### `start-frontend.bat` - Frontend Only
Starts just the Next.js frontend.

**Usage:** Double-click or run in terminal
```cmd
start-frontend.bat
```

### `stop-dev.bat` - Stop All Servers
Kills all Node.js processes to cleanly stop servers.

**Usage:** Double-click when you want to stop development
```cmd
stop-dev.bat
```

---

## Why Batch Files (.bat)?

✅ **No configuration needed** - Just works on any Windows system  
✅ **No PowerShell execution policy issues** - No admin rights required  
✅ **Separate windows** - Servers run independently in background  
✅ **Easy to use** - Just double-click!  

---

## Workflow

1. **Start Development**
   - Double-click `start-dev.bat`
   - Two windows open (backend + frontend)
   - Minimize them and start coding!

2. **During Development**
   - Both servers auto-reload on file changes
   - Check backend: http://localhost:8080/health
   - Check frontend: http://localhost:3000

3. **Stop Development**
   - Double-click `stop-dev.bat`
   - Or just close the command windows

---

## Troubleshooting

### "Port already in use"
- Run `stop-dev.bat` first
- Or manually: Open Task Manager → End all Node.js processes

### "npm command not found"
- Make sure Node.js is installed: `node --version`
- Restart your terminal after installing Node.js

### Want to see server logs?
- Don't close the command windows!
- They show all server output and errors

---

## Alternative: PowerShell Scripts

If you prefer PowerShell (requires execution policy setup):
- `start-dev.ps1`
- `start-backend.ps1`
- `start-frontend.ps1`

**Note:** Batch files work better without any configuration!
