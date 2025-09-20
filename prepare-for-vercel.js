#!/usr/bin/env node

/**
 * Vercel deployment preparation script
 * This script helps prepare your application for Vercel deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing for Vercel deployment...');

// Check if Next.js config is optimized for production
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
const nextConfigProductionPath = path.join(process.cwd(), 'next.config.production.js');

if (fs.existsSync(nextConfigProductionPath)) {
  console.log('📝 Applying production Next.js configuration...');
  fs.copyFileSync(nextConfigProductionPath, nextConfigPath);
  console.log('✅ Production Next.js configuration applied!');
}

// Create vercel.json if it doesn't exist
const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  console.log('📝 Creating Vercel configuration file...');
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "headers": {
          "x-content-type-options": "nosniff",
          "x-frame-options": "DENY",
          "x-xss-protection": "1; mode=block"
        },
        "continue": true
      },
      {
        "handle": "filesystem"
      },
      {
        "src": "/api/(.*)",
        "dest": "/api/$1"
      },
      {
        "src": "/(.*)",
        "dest": "/"
      }
    ]
  };
  
  fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Vercel configuration file created!');
}

// Check if .gitignore includes Vercel-specific entries
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  console.log('📝 Updating .gitignore for Vercel...');
  let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  const vercelEntries = [
    '.vercel',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local'
  ];
  
  let updated = false;
  for (const entry of vercelEntries) {
    if (!gitignoreContent.includes(entry)) {
      gitignoreContent += `\n${entry}`;
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('✅ .gitignore updated with Vercel-specific entries!');
  } else {
    console.log('✅ .gitignore already contains Vercel-specific entries!');
  }
}

// Create a sample .env.production file if it doesn't exist
const envProductionPath = path.join(process.cwd(), '.env.production');
if (!fs.existsSync(envProductionPath)) {
  console.log('📝 Creating sample .env.production file...');
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-production-supabase-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Cashfree Configuration
CASHFREE_APP_ID=your-production-cashfree-app-id
CASHFREE_SECRET_KEY=your-production-cashfree-secret-key

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-vercel-deployment-url.vercel.app
NODE_ENV=production
`;
  
  fs.writeFileSync(envProductionPath, envContent);
  console.log('✅ Sample .env.production file created!');
  console.log('⚠️  Remember to update the values in .env.production with your actual credentials!');
}

console.log('\n🎉 Preparation for Vercel deployment complete!');
console.log('\nNext steps:');
console.log('1. Push your code to a Git repository');
console.log('2. Import your repository in Vercel');
console.log('3. Configure environment variables in Vercel dashboard');
console.log('4. Deploy your application');
console.log('\nFor detailed instructions, see VERCEL_DEPLOYMENT.md');