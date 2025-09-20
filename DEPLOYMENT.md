# Deployment Guide

This guide provides instructions for deploying the Cashfree payment integration application to production environments.

## Prerequisites

- Node.js 18 or later
- Production Supabase account and project
- Production Cashfree account and API credentials
- Docker and Docker Compose (optional, for containerized deployment)

## Deployment Options

### 1. Traditional Deployment

1. Set up your environment variables:
   ```bash
   cp .env.local.example .env.production
   ```

2. Edit `.env.production` with your production credentials:
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

3. Run the deployment script:
   ```bash
   node deploy.js
   ```

### 2. Docker Deployment

1. Set up your environment variables in a `.env` file:
   ```bash
   cp .env.local.example .env
   ```

2. Edit `.env` with your production credentials (same as above).

3. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

### 3. Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Connect your repository to Vercel

3. Configure the environment variables in the Vercel dashboard

4. Deploy your application

## Production Configuration

### Next.js Configuration

For production deployments, use the optimized Next.js configuration:

```bash
cp next.config.production.js next.config.js
```

### Supabase Setup

1. Create a production Supabase project

2. Run the SQL schema from `supabase-schema.sql` in your production Supabase SQL editor

3. Set up appropriate Row Level Security (RLS) policies

### Cashfree Setup

1. Configure your production webhook URLs in the Cashfree dashboard to point to your production domain

2. Complete the KYC and other requirements for a production Cashfree account

## Monitoring and Maintenance

### Health Checks

The application includes a health check endpoint at `/api/health` that can be used to monitor the application's status.

### Logs

In production, you should set up proper logging and monitoring. Consider using services like:

- Sentry for error tracking
- Datadog or New Relic for application performance monitoring
- Papertrail or Loggly for log management

## Scaling

For high-traffic applications, consider:

1. Using a CDN like Cloudflare or Vercel Edge Network

2. Implementing caching strategies

3. Scaling your database with Supabase's paid plans

## Security Considerations

1. Always use HTTPS in production

2. Keep your environment variables secure

3. Regularly update dependencies

4. Follow security best practices for Next.js and Supabase

## Troubleshooting

If you encounter issues during deployment:

1. Check the application logs

2. Verify your environment variables

3. Test the database connection

4. Ensure Cashfree API credentials are correct

5. Verify webhook configurations