const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const { spawn } = require('child_process');

let backendProcess;

function startBackend() {
  // Ejecuta el backend en modo producción
  backendProcess = spawn(
    process.platform === 'win32' ? 'node.exe' : 'node',
    ['dist/main.js'],
    {
      cwd: path.join(__dirname, 'backend'),
      env: process.env,
      stdio: 'inherit', // Para ver los logs en la consola de Electron
    }
  );
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    minHeight: 500,
    minWidth: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  win.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});