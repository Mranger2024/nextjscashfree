# Cashfree Payment Integration with Next.js and Supabase

## Overview

This application demonstrates a complete integration of Cashfree Payment Gateway with Next.js and Supabase. It provides a seamless payment experience for users, with features like payment processing, order management, and payment verification.

## Getting Started

### Development

1. Clone the repository
2. Copy `.env.local.example` to `.env.local`
3. Fill in your Supabase and Cashfree credentials
4. Install dependencies: `npm install`
5. Run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

For production deployment, follow these steps:

1. Run the production setup script: `npm run setup:prod`
2. Build the application: `npm run build`
3. Start the production server: `npm run prod`

Alternatively, you can use the deployment script:

```bash
npm run deploy
```

### Vercel Deployment

To deploy to Vercel, follow these steps:

1. Run the Vercel preparation script: `npm run vercel:prepare`
2. Push your code to a Git repository
3. Connect your repository to Vercel
4. Configure environment variables in Vercel dashboard
5. Deploy your application

If you encounter any deployment issues, run the fix script:

```bash
npm run vercel:fix
```

For detailed instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).
For troubleshooting common issues, see [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md).

### Docker Deployment

This application includes Docker configuration for easy deployment:

```bash
# Build the Docker image
npm run docker:build

# Start the Docker container
npm run docker:start

# Stop the Docker container
npm run docker:stop
```

## How It Works

### Payment Flow

1. User fills out the booking form with patient details
2. Application creates a booking record in Supabase
3. Application creates an order in Cashfree
4. User is redirected to Cashfree payment page
5. After payment, user is redirected back to the application
6. Application verifies the payment status with Cashfree
7. Application updates the booking status in Supabase

### Production Mode

In production mode, the application:

1. Uses the Cashfree PRODUCTION environment instead of SANDBOX
2. Connects to your production Supabase database
3. Uses optimized Next.js configuration for better performance
4. Implements security headers for better protection
5. Provides health check endpoints for monitoring

## Documentation

- [Production Setup Guide](./PRODUCTION_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Supabase Setup](./SUPABASE_SETUP.md)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run prod` - Start in production mode
- `npm run setup:prod` - Set up production environment
- `npm run deploy` - Deploy to production
- `npm run docker:build` - Build Docker image
- `npm run docker:start` - Start Docker container
- `npm run docker:stop` - Stop Docker container

## Deploy on Vercel

For production deployment on Vercel:

1. Prepare your application for Vercel deployment:
   ```bash
   npm run vercel:prepare
   ```

2. Push your code to a Git repository (GitHub, GitLab, etc.)

3. Connect your repository to Vercel

4. Configure the following environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CASHFREE_APP_ID` (production credentials)
   - `CASHFREE_SECRET_KEY` (production credentials)
   - `NEXT_PUBLIC_BASE_URL` (your Vercel deployment URL)
   - `NODE_ENV=production`

5. Deploy your application

Vercel will automatically build and deploy your application with the production configuration.

For detailed instructions, see [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md).
