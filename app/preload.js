const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // You can add IPC methods here if needed
  platform: process.platform,
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000/api'
  }
});
