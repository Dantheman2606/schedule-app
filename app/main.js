const { app, BrowserWindow } = require('electron');
const path = require('path');
const dotenv = require('dotenv');

// Load .env file before anything else
const envPath = app.isPackaged 
  ? path.join(process.resourcesPath, 'app', '.env')
  : path.join(__dirname, '.env');

dotenv.config({ path: envPath });

// Make sure BACKEND_URL is available
if (!process.env.BACKEND_URL) {
  process.env.BACKEND_URL = 'http://localhost:3000/api';
}

// Simple check for development mode
const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  // Log console messages from the renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer Console]: ${message}`);
  });

  // Load the frontend
  const indexPath = path.join(__dirname, 'frontend', 'index.html');
  console.log('Loading:', indexPath);
  
  if (isDev) {
    // In development, load the built frontend
    mainWindow.loadFile(indexPath);
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built frontend
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
