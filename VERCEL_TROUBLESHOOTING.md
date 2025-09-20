# Vercel Deployment Troubleshooting

This guide helps you resolve common issues when deploying the Cashfree payment integration application to Vercel.

## Common Deployment Errors

### Type Error in API Routes

**Error Message:**
```
Type error: Type 'typeof import("/vercel/path0/src/app/api/status/[orderId]/route")' does not satisfy the constraint 'RouteHandlerConfig<"/api/status/[orderId]">'. 
Types of property 'GET' are incompatible.
```

**Solution:**
This error occurs because of a type mismatch in the API route handler parameters. In Next.js 15.5+, the route handler parameter structure has changed. Run the fix script to automatically update all API route handlers:

```bash
npm run vercel:fix
```

### Invalid next.config.js Options

**Error Message:**
```
⚠ Invalid next.config.js options detected:  
⚠ Unrecognized key(s) in object: 'swcMinify' 
```

**Solution:**
The `swcMinify` option is no longer recognized in newer versions of Next.js. Run the fix script to remove this option and add proper Turbopack configuration:

```bash
npm run vercel:fix
```

### Turbopack Configuration Warning

**Error Message:**
```
⚠ Webpack is configured while Turbopack is not, which may cause problems.
```

**Solution:**
This warning occurs when using Turbopack without proper configuration. Run the fix script to add the necessary Turbopack configuration:

```bash
npm run vercel:fix
```

### Build Settings Conflict

**Error Message:**
```
WARN! Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply.
```

**Solution:**
This warning occurs when there's a conflict between the `builds` configuration in vercel.json and the project settings. Run the fix script to remove the conflicting configuration:

```bash
npm run vercel:fix
```

## Manual Fixes

If the fix script doesn't resolve your issues, you can manually apply these changes:

### 1. Update package.json

Remove the `--turbopack` flag from the build script:

```json
"scripts": {
  "build": "next build"
}
```

### 2. Update next.config.js

Remove `swcMinify` and add Turbopack configuration:

```js
// Remove this line
swcMinify: true,

// Add this configuration
turbopack: {
  // Add any necessary Turbopack configuration here
},
```

### 3. Update vercel.json

Remove the `builds` configuration if present:

```json
{
  "version": 2,
  // Remove the builds section
  "routes": [...],
  "env": {...}
}
```

### 4. Fix API Route Handlers

Update all API route handlers to use the correct parameter structure:

```typescript
// Before
export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  const { orderId } = params;
  // ...
}

// After
export async function GET(req: NextRequest, context: { params: { orderId: string } }) {
  const { orderId } = context.params;
  // ...
}
```

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Troubleshooting Vercel Deployments](https://vercel.com/docs/deployments/troubleshooting)