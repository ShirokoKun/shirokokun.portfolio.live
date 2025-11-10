# 🕸️ Mindscape Portfolio - Development Scripts

## Quick Start

### Start Everything (Recommended)
```powershell
.\start-dev.ps1
```
This will:
- Clean up any existing processes on ports 3000 and 8080
- Open a new terminal window for the **Backend Server** (port 8080)
- Open a new terminal window for the **Frontend Server** (port 3000)
- Both terminals stay open in the background so you can keep working

### Start Individual Servers

**Backend Only:**
```powershell
.\start-backend.ps1
```

**Frontend Only:**
```powershell
.\start-frontend.ps1
```

### Stop All Servers
```powershell
.\stop-dev.ps1
```
This kills all Node processes on ports 3000 and 8080.

---

## URLs

After starting the servers:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Mindscape Visualization:** http://localhost:3000/mindscape
- **Backend Health:** http://localhost:8080/health

---

## How It Works

These scripts use PowerShell's `Start-Process` to launch new terminal windows that:

1. **Run in the background** - Your main terminal stays free for git, testing, etc.
2. **Stay open** - `-NoExit` keeps the windows open even after the server starts
3. **Auto-clean** - `start-dev.ps1` kills existing processes to avoid port conflicts
4. **Easy to stop** - Just close the terminal windows or run `stop-dev.ps1`

---

## Troubleshooting

### "Execution of scripts is disabled"
If you see this error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
Run the stop script first:
```powershell
.\stop-dev.ps1
```
Then try starting again.

### Manual Port Check
```powershell
# Check what's using port 8080
netstat -ano | findstr ":8080"

# Check what's using port 3000
netstat -ano | findstr ":3000"

# Kill a specific process by PID
taskkill /PID <PID> /F
```

---

## Development Workflow

1. **Start servers:** `.\start-dev.ps1`
2. **Make changes** to your code
3. **Servers auto-reload** (tsx watch for backend, Next.js Fast Refresh for frontend)
4. **Test in browser:** http://localhost:3000/mindscape
5. **Stop servers when done:** Close terminal windows or run `.\stop-dev.ps1`

---

## What's Running?

### Backend Terminal Window
- Express API server (port 8080)
- Google Sheets integration
- Email service (nodemailer)
- Substack RSS proxy
- Mindscape data API

### Frontend Terminal Window
- Next.js dev server (port 3000)
- React Flow graph visualization
- Tailwind CSS compilation
- Fast Refresh for instant updates

---

Happy coding! 🚀
