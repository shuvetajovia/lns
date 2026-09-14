const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "Mother Nature | Shop Owner Command Center",
        icon: path.join(__dirname, 'public/favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // In production: win.loadFile('dist/index.html')
    // In development:
    win.loadURL('http://localhost:5180');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
