#!/usr/bin/env node

/**
 * Production setup script
 * This script helps set up the production environment for the Cashfree payment integration application
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the environment variables needed for production
const envVars = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    message: 'Enter your Supabase URL (https://your-project-id.supabase.co):',
    default: '',
    validate: (input) => input.startsWith('https://') && input.includes('supabase.co')
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    message: 'Enter your Supabase service role key:',
    default: '',
    validate: (input) => input.length > 20
  },
  {
    name: 'CASHFREE_APP_ID',
    message: 'Enter your Cashfree production App ID:',
    default: '',
    validate: (input) => input.length > 0
  },
  {
    name: 'CASHFREE_SECRET_KEY',
    message: 'Enter your Cashfree production Secret Key:',
    default: '',
    validate: (input) => input.length > 10
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL',
    message: 'Enter your production domain (https://your-domain.com):',
    default: '',
    validate: (input) => input.startsWith('https://')
  }
];

// Create .env.production file
const createEnvFile = (answers) => {
  const envContent = Object.entries(answers)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const envWithDefaults = `${envContent}\nNODE_ENV=production\n`;

  fs.writeFileSync(
    path.join(process.cwd(), '.env.production'),
    envWithDefaults
  );

  console.log('✅ .env.production file created successfully!');
};

// Set up Next.js production config
const setupNextConfig = () => {
  try {
    fs.copyFileSync(
      path.join(process.cwd(), 'next.config.production.js'),
      path.join(process.cwd(), 'next.config.js')
    );
    console.log('✅ Production Next.js configuration applied!');
  } catch (error) {
    console.error('❌ Failed to apply production Next.js configuration:', error.message);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Setting up production environment...');
  
  const answers = {};
  
  // Ask questions sequentially
  for (const envVar of envVars) {
    const answer = await new Promise((resolve) => {
      rl.question(`${envVar.message} `, (input) => {
        const value = input.trim() || envVar.default;
        if (!envVar.validate(value)) {
          console.log('❌ Invalid input. Please try again.');
          resolve(null);
        } else {
          resolve(value);
        }
      });
    });
    
    if (answer === null) {
      // If validation failed, ask the same question again
      envVars.unshift(envVar);
    } else {
      answers[envVar.name] = answer;
    }
  }
  
  rl.close();
  
  // Create the environment file
  createEnvFile(answers);
  
  // Set up Next.js config
  setupNextConfig();
  
  console.log('\n🎉 Production setup complete!');
  console.log('\nNext steps:');
  console.log('1. Run `npm run build` to build the application for production');
  console.log('2. Run `npm start` to start the production server');
  console.log('\nAlternatively, run `node deploy.js` to build and start the application');
};

// Run the main function
main().catch((error) => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
});