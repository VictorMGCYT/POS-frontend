
/**
 * main.cjs - Proceso principal de Electron
 *
 * Este archivo se encarga de:
 * 1. Lanzar la ventana principal de la app (frontend React)
 * 2. Lanzar el backend de NestJS como un proceso hijo usando Node.js
 *
 * ¿Cómo funciona el arranque del backend?
 *
 * - En desarrollo:
 *   - Usa el Node.js global del sistema ('node.exe')
 *   - Ejecuta el backend desde electron/backend/dist/main.js
 *   - El cwd es electron/backend (donde está node_modules y dist)
 *
 * - En producción (app empaquetada):
 *   - Usa el node.exe que se incluye en el build (dentro de app.asar.unpacked/electron/node.exe)
 *   - Ejecuta el backend desde app.asar.unpacked/electron/backend/dist/main.js
 *   - El cwd es app.asar.unpacked/electron/backend (donde también debe estar node_modules)
 *
 * Es fundamental que node_modules del backend esté presente en la ruta descomprimida,
 * ya que el código compilado de NestJS sigue requiriendo dependencias externas.
 *
 * El backend se lanza como proceso hijo y se mantiene vivo mientras la app esté abierta.
 * Al cerrar todas las ventanas, el proceso backend se termina.
 */

const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');
const { spawn } = require('child_process');

let backendProcess;

/**
 * Lanza el backend de NestJS como proceso hijo de Electron.
 * Detecta si está en desarrollo o producción y ajusta rutas y ejecutable de Node.
 */
function startBackend() {
  let nodePath;
  if (process.platform === 'win32') {
    if (app.isPackaged) {
      // En producción: usa el node.exe incluido en el build
      nodePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'node.exe');
    } else {
      // En desarrollo: usa node.exe global
      nodePath = 'node.exe';
    }
  } else {
    nodePath = 'node';
  }

  let backendScript;
  let backendCwd;
  if (process.platform === 'win32' && app.isPackaged) {
    // En producción: usa la ruta real del backend descomprimido
    backendScript = path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'backend', 'dist', 'main.js');
    backendCwd = path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'backend');
  } else {
    // En desarrollo
    backendScript = 'dist/main.js';
    backendCwd = path.join(__dirname, 'backend');
  }
  backendProcess = spawn(
    nodePath,
    [backendScript],
    {
      cwd: backendCwd,
      env: process.env,
      stdio: 'inherit',
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