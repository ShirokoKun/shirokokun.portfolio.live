# Deployment Preparation Script
# Run this script before pushing to GitHub

Write-Host "🚀 Portfolio Deployment Preparation" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check current branch
Write-Host "📍 Current Branch:" -ForegroundColor Yellow
git branch --show-current
Write-Host ""

# 2. Check for sensitive files
Write-Host "🔍 Checking for sensitive files..." -ForegroundColor Yellow
$sensitiveFiles = @(
    "portfolio-website\.env.local",
    "portfolio-backend\.env",
    ".env"
)

$foundSensitive = $false
foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        Write-Host "⚠️  Found: $file" -ForegroundColor Red
        $foundSensitive = $true
    }
}

if ($foundSensitive) {
    Write-Host ""
    Write-Host "❌ Sensitive files detected! They should NOT be committed." -ForegroundColor Red
    Write-Host "Removing from git cache..." -ForegroundColor Yellow
    git rm --cached portfolio-website/.env.local 2>$null
    git rm --cached portfolio-backend/.env 2>$null
    git rm --cached .env 2>$null
    Write-Host "✅ Removed from git cache" -ForegroundColor Green
} else {
    Write-Host "✅ No sensitive files in git" -ForegroundColor Green
}
Write-Host ""

# 3. Verify .env.example files exist
Write-Host "📄 Checking for .env.example files..." -ForegroundColor Yellow
if (Test-Path "portfolio-website\.env.example") {
    Write-Host "✅ Frontend .env.example exists" -ForegroundColor Green
} else {
    Write-Host "❌ Missing: portfolio-website\.env.example" -ForegroundColor Red
}

if (Test-Path "portfolio-backend\.env.example") {
    Write-Host "✅ Backend .env.example exists" -ForegroundColor Green
} else {
    Write-Host "❌ Missing: portfolio-backend\.env.example" -ForegroundColor Red
}
Write-Host ""

# 4. Check git status
Write-Host "📊 Git Status:" -ForegroundColor Yellow
git status --short
Write-Host ""

# 5. Summary
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review changes above" -ForegroundColor White
Write-Host "2. Run: git add ." -ForegroundColor White
Write-Host "3. Run: git commit -m 'chore: prepare for deployment'" -ForegroundColor White
Write-Host "4. Run: git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "5. Create backend branch:" -ForegroundColor White
Write-Host "   git checkout -b backend-deploy" -ForegroundColor Gray
Write-Host "   git push origin backend-deploy" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Create frontend branch:" -ForegroundColor White
Write-Host "   git checkout main" -ForegroundColor Gray
Write-Host "   git checkout -b frontend-deploy" -ForegroundColor Gray
Write-Host "   git push origin frontend-deploy" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Ready to deploy!" -ForegroundColor Green
