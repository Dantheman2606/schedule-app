const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Electron app...\n');

// Step 1: Build the frontend
console.log('Step 1: Building frontend...');
try {
  execSync('npm run build', {
    cwd: path.join(__dirname, '..', 'frontend'),
    stdio: 'inherit'
  });
  console.log('✓ Frontend built successfully\n');
} catch (error) {
  console.error('✗ Failed to build frontend');
  process.exit(1);
}

// Step 2: Copy frontend build to app folder
console.log('Step 2: Copying frontend build to app folder...');
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
const appFrontendPath = path.join(__dirname, 'frontend');

// Remove old frontend folder if it exists
if (fs.existsSync(appFrontendPath)) {
  fs.rmSync(appFrontendPath, { recursive: true, force: true });
}

// Create new frontend folder
fs.mkdirSync(appFrontendPath, { recursive: true });

// Copy all files from frontend/dist to app/frontend
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(frontendDistPath, appFrontendPath);
console.log('✓ Frontend copied successfully\n');

// Step 3: Update frontend API URL to use environment variable
console.log('Step 3: Creating API configuration...');
const apiConfigPath = path.join(appFrontendPath, 'api-config.js');
const apiConfigContent = `
window.API_CONFIG = {
  baseURL: window.electron?.env?.BACKEND_URL || 'http://localhost:3000/api'
};
`;
fs.writeFileSync(apiConfigPath, apiConfigContent);

// Inject the config script into index.html
const indexHtmlPath = path.join(appFrontendPath, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Add script tag right after opening head tag (before other scripts)
if (!indexHtml.includes('api-config.js')) {
  indexHtml = indexHtml.replace(
    '<head>',
    '<head>\n  <script src="./api-config.js"></script>'
  );
  fs.writeFileSync(indexHtmlPath, indexHtml);
}

console.log('✓ API configuration created\n');

console.log('Build complete! You can now run:');
console.log('  npm start          - Run the app in development mode');
console.log('  npm run package    - Package the app for Windows x64');
console.log('  npm run package:all - Package for all platforms');
