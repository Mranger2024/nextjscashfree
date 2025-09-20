# Production Setup Guide

This guide will help you set up the Cashfree payment integration application for production use.

## Environment Configuration

1. Create a `.env.production` file in the root of your project with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-production-supabase-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Cashfree Configuration
CASHFREE_APP_ID=your-production-cashfree-app-id
CASHFREE_SECRET_KEY=your-production-cashfree-secret-key

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
NODE_ENV=production
```

2. Make sure to replace the placeholder values with your actual production credentials.

## Supabase Production Setup

1. Create a production Supabase project if you haven't already.
2. Run the SQL schema from `supabase-schema.sql` in your production Supabase SQL editor.
3. Set up appropriate Row Level Security (RLS) policies for your production database.
4. Generate a service role key from the Supabase dashboard and add it to your environment variables.

## Cashfree Production Setup

1. Create a production account on Cashfree if you haven't already.
2. Obtain your production App ID and Secret Key from the Cashfree dashboard.
3. Configure your production webhook URLs in the Cashfree dashboard to point to your production domain.
4. Complete the KYC and other requirements for a production Cashfree account.

## Application Deployment

### Option 1: Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy your application

### Option 2: Traditional Hosting

1. Build your Next.js application for production:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Post-Deployment Verification

1. Test the complete payment flow in production
2. Verify that webhooks are properly configured and working
3. Check that database connections are established correctly
4. Monitor logs for any errors or issues

## Important Notes

- The application is already configured to use production mode when `NODE_ENV` is set to 'production'
- Both Cashfree SDK initialization and Supabase connections will automatically use production settings
- Make sure your production domain has HTTPS enabled for secure payments
- Set up proper error monitoring and logging for production use