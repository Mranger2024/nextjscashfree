// fix-vercel-deploy.js
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Vercel deployment issues...');

// 1. Update package.json to remove turbopack from build script
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove turbopack flag from build script
  if (packageJson.scripts && packageJson.scripts.build && packageJson.scripts.build.includes('--turbopack')) {
    packageJson.scripts.build = 'next build';
    console.log('✅ Updated build script in package.json to remove --turbopack flag');
  } else {
    console.log('ℹ️ Build script already correctly configured');
  }
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
} catch (error) {
  console.error('❌ Error updating package.json:', error.message);
}

// 2. Update next.config.js to fix configuration issues
try {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Remove swcMinify if present
  if (nextConfigContent.includes('swcMinify: true')) {
    nextConfigContent = nextConfigContent.replace(
      /\s*swcMinify:\s*true,?/g,
      ''
    );
    console.log('✅ Removed swcMinify from next.config.js');
  } else {
    console.log('ℹ️ swcMinify not found in next.config.js');
  }
  
  // Add turbopack configuration if not present
  if (!nextConfigContent.includes('turbopack:')) {
    nextConfigContent = nextConfigContent.replace(
      /const nextConfig = {/,
      'const nextConfig = {\n  // Turbopack configuration\n  turbopack: {},'
    );
    console.log('✅ Added turbopack configuration to next.config.js');
  } else {
    console.log('ℹ️ turbopack configuration already exists in next.config.js');
  }
  
  fs.writeFileSync(nextConfigPath, nextConfigContent);
} catch (error) {
  console.error('❌ Error updating next.config.js:', error.message);
}

// 3. Update vercel.json to remove builds configuration
try {
  const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
  if (fs.existsSync(vercelJsonPath)) {
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    
    // Remove builds configuration if present
    if (vercelJson.builds) {
      delete vercelJson.builds;
      console.log('✅ Removed builds configuration from vercel.json');
      fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
    } else {
      console.log('ℹ️ No builds configuration found in vercel.json');
    }
  } else {
    console.log('ℹ️ vercel.json not found');
  }
} catch (error) {
  console.error('❌ Error updating vercel.json:', error.message);
}

// 4. Fix API route handler type issues
try {
  const apiDirPath = path.join(process.cwd(), 'src', 'app', 'api');
  if (fs.existsSync(apiDirPath)) {
    // Find all route.ts files in the API directory recursively
    function findRouteFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findRouteFiles(filePath, fileList);
        } else if (file === 'route.ts' || file === 'route.js') {
          fileList.push(filePath);
        }
      });
      
      return fileList;
    }
    
    const routeFiles = findRouteFiles(apiDirPath);
    console.log(`Found ${routeFiles.length} API route files to check`);
    
    let fixedCount = 0;
    
    routeFiles.forEach(filePath => {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Fix the params type issue
      if (content.includes('{ params }: { params:')) {
        content = content.replace(
          /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(\s*req\s*:\s*NextRequest\s*,\s*{\s*params\s*}\s*:\s*{\s*params\s*:/g,
          'export async function $1(req: NextRequest, context: { params:'
        );
        
        // Also update any references to params to context.params
        content = content.replace(
          /const\s*{([^}]+)}\s*=\s*params\s*;/g,
          'const {$1} = context.params;'
        );
        
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        fixedCount++;
        console.log(`✅ Fixed API route handler in ${filePath}`);
      }
    });
    
    console.log(`✅ Fixed ${fixedCount} API route handlers`);
  } else {
    console.log('ℹ️ API directory not found');
  }
} catch (error) {
  console.error('❌ Error fixing API route handlers:', error.message);
}

console.log('🎉 Vercel deployment fixes completed!');
console.log('📝 Next steps:');
console.log('1. Commit these changes to your repository');
console.log('2. Push to your Vercel-connected repository');
console.log('3. Vercel should now be able to build and deploy your application');