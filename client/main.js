const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 400,
        backgroundColor: '#1a1a1a',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Since main.js is ALREADY in the client folder, just load index.html
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// Handle file selection
ipcMain.handle('open-file', async (event, target) => {
    const filters = target === 'video' 
        ? [{ name: 'Movies', extensions: ['mkv', 'mp4', 'avi', 'webm'] }]
        : [{ name: 'Subs', extensions: ['srt', 'ass'] }];
        
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: filters
    });

    if (result.canceled) return null;
    return result.filePaths[0];
});

// Allow the renderer to minimize the control window
ipcMain.on('minimize-me', () => {
    if (mainWindow) mainWindow.minimize();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  // Tell renderer to clean up mpv before the process exits
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript('window.__mpvCleanup && window.__mpvCleanup()');
  }
});