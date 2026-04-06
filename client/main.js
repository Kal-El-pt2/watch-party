const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 450, height: 350,
        backgroundColor: '#1a1a1a',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// Handler for the File Picker
ipcMain.handle('open-file', async (event, target) => {
    const filters = target === 'video' 
        ? [{ name: 'Movies', extensions: ['mkv', 'mp4', 'avi'] }]
        : [{ name: 'Subs', extensions: ['srt', 'ass'] }];
    const result = await dialog.showOpenDialog({ filters });
    return result.filePaths[0];
});

// Listener for the Minimize Command
ipcMain.on('minimize-me', () => {
    if (mainWindow) mainWindow.minimize();
});

app.whenReady().then(createWindow);