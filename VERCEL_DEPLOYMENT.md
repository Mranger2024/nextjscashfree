# Deploying to Vercel

This guide provides step-by-step instructions for deploying the Cashfree payment integration application to Vercel.

## Troubleshooting Deployment Issues

If you encounter build errors during deployment, run the fix script:

```bash
npm run vercel:fix
```

This script automatically fixes common Vercel deployment issues:
- Removes the `--turbopack` flag from the build script
- Fixes Next.js configuration issues
- Updates API route handlers to match Next.js 15.5+ type requirements
- Removes conflicting builds configuration from vercel.json

For detailed troubleshooting steps and solutions to common errors, see the [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md) guide.

## Prerequisites

- A [Vercel](https://vercel.com) account
- A GitHub, GitLab, or Bitbucket account to host your repository
- Your production Supabase credentials
- Your production Cashfree credentials

## Deployment Steps

### 1. Prepare Your Repository

1. Run the Vercel preparation script:

```bash
npm run vercel:prepare
```

This script will:
- Apply production Next.js configuration
- Create a Vercel configuration file (vercel.json)
- Update .gitignore with Vercel-specific entries
- Create a sample .env.production file

2. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

```bash
# Initialize Git repository if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin <your-repository-url>

# Push to remote repository
git push -u origin main
```

### 2. Connect to Vercel

1. Log in to your [Vercel account](https://vercel.com)
2. Click on "Add New..." > "Project"
3. Import your Git repository
4. Select the repository containing your Cashfree Next.js application

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-production-supabase-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Cashfree Configuration
CASHFREE_APP_ID=your-production-cashfree-app-id
CASHFREE_SECRET_KEY=your-production-cashfree-secret-key

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-vercel-deployment-url.vercel.app
NODE_ENV=production
```

> **Note**: After your first deployment, update `NEXT_PUBLIC_BASE_URL` with your actual Vercel deployment URL.

### 4. Configure Build Settings

1. Framework Preset: Next.js
2. Build Command: `next build`
3. Output Directory: `.next`
4. Install Command: `npm install`

### 5. Deploy

#### Option 1: Deploy via Vercel Dashboard

Click the "Deploy" button to start the deployment process.

#### Option 2: Deploy via Command Line

You can also deploy directly from the command line using the Vercel CLI:

```bash
npm run vercel:deploy
```

This script will:
- Install the Vercel CLI if not already installed
- Prepare your application for Vercel deployment
- Log you in to Vercel if needed
- Deploy your application to Vercel

### 6. Verify Deployment

1. Once deployment is complete, Vercel will provide you with a deployment URL
2. Visit the URL to verify that your application is running correctly
3. Test the complete payment flow to ensure everything works as expected

### 7. Custom Domain (Optional)

1. In your Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow the instructions to configure DNS settings
4. Update `NEXT_PUBLIC_BASE_URL` environment variable with your custom domain

## Continuous Deployment

Vercel automatically sets up continuous deployment for your project. Any changes pushed to your repository will trigger a new deployment.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs for errors
   - Ensure all dependencies are correctly installed
   - Verify that your Next.js configuration is compatible with Vercel

2. **Environment Variable Issues**
   - Double-check that all required environment variables are set correctly
   - Ensure that variables prefixed with `NEXT_PUBLIC_` are accessible in the client-side code

3. **API Routes Not Working**
   - Verify that your API routes are correctly configured for serverless deployment
   - Check for any hardcoded URLs that might need to be updated

4. **Cashfree Integration Issues**
   - Ensure your Cashfree webhook URLs are updated to point to your Vercel deployment
   - Verify that you're using production Cashfree credentials

## Monitoring and Logs

1. Vercel provides built-in monitoring and logs for your deployments
2. Access logs from the Vercel dashboard under your project's "Deployments" tab
3. Consider setting up additional monitoring tools for production use

## Scaling

Vercel automatically scales your application based on traffic. For high-traffic applications, consider upgrading to a paid Vercel plan for better performance and more features.