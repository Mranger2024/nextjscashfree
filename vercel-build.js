const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Vercel build process...');

// Ensure required environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'CASHFREE_APP_ID',
  'CASHFREE_SECRET_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Error: The following required environment variables are missing:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  process.exit(1);
}

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  
  // Install peer dependencies if needed
  const peerDeps = ['tailwindcss', 'postcss', 'autoprefixer'];
  const installedDeps = execSync('npm list --depth=0 --json').toString();
  const installedPackages = JSON.parse(installedDeps).dependencies || {};
  
  const depsToInstall = peerDeps.filter(dep => !installedPackages[dep]);
  
  if (depsToInstall.length > 0) {
    console.log(`Installing missing peer dependencies: ${depsToInstall.join(', ')}`);
    execSync(`npm install --save-dev ${depsToInstall.join(' ')}`, { stdio: 'inherit' });
  }
  
  // Run the build
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
