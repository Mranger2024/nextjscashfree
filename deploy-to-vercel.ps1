# PowerShell script for deploying to Vercel

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Prepare for Vercel deployment
Write-Host "Preparing for Vercel deployment..." -ForegroundColor Cyan
node prepare-for-vercel.js

# Check if user is logged in to Vercel
Write-Host "Checking Vercel login status..." -ForegroundColor Cyan
$loginStatus = vercel whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to log in to Vercel first." -ForegroundColor Yellow
    vercel login
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Green
vercel --prod

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Remember to set up your environment variables in the Vercel dashboard." -ForegroundColor Yellow