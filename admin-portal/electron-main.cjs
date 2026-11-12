const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
function createWindow() {
  const win = new BrowserWindow({ width: 1200, height: 800, title: 'Mother Nature | Admin',
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    const current = win.webContents.getURL().split('#')[0];
    if (url.split('#')[0] !== current) event.preventDefault();
  });
  if (app.isPackaged) win.loadFile(path.join(__dirname, 'dist/index.html'));
  else win.loadURL('http://localhost:5180/#/admin');
}
app.whenReady().then(createWindow);
app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
