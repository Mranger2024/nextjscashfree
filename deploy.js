// Production deployment script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we're in production mode
process.env.NODE_ENV = 'production';

// Check if .env.production exists
if (!fs.existsSync(path.join(process.cwd(), '.env.production'))) {
  console.error('❌ .env.production file not found!');
  console.log('Please create a .env.production file with your production credentials.');
  console.log('See PRODUCTION_SETUP.md for details.');
  process.exit(1);
}

console.log('🚀 Starting production deployment...');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the application
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Test the build
  console.log('🧪 Testing build...');
  execSync('npm run start', { stdio: 'inherit' });

  console.log('✅ Deployment successful!');
  console.log('Your application is now running in production mode.');
  console.log('Press Ctrl+C to stop the server.');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}