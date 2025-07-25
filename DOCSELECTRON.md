
# Documentación: Arranque del backend NestJS desde Electron

## ¿Qué hace el main.cjs?

El archivo `electron/main.cjs` es el proceso principal de Electron y se encarga de:

1. Lanzar la ventana principal de la app (frontend React).
2. Lanzar el backend de NestJS como un proceso hijo usando Node.js.

## ¿Cómo se lanza el backend?

- **En desarrollo:**
  - Usa el Node.js global del sistema (`node.exe`).
  - Ejecuta el backend desde `electron/backend/dist/main.js`.
  - El directorio de trabajo (`cwd`) es `electron/backend` (donde está `node_modules` y `dist`).

- **En producción (app empaquetada):**
  - Usa el `node.exe` que se incluye en el build (dentro de `app.asar.unpacked/electron/node.exe`).
  - Ejecuta el backend desde `app.asar.unpacked/electron/backend/dist/main.js`.
  - El `cwd` es `app.asar.unpacked/electron/backend` (donde también debe estar `node_modules`).

> **IMPORTANTE:**
> El backend de NestJS, aunque esté compilado en `dist`, sigue requiriendo dependencias externas. Por eso, es fundamental que la carpeta `node_modules` del backend esté presente en la ruta descomprimida (`app.asar.unpacked/electron/backend/node_modules`).

El backend se lanza como proceso hijo y se mantiene vivo mientras la app esté abierta. Al cerrar todas las ventanas, el proceso backend se termina automáticamente.

---

### Resumen del código relevante en main.cjs

```js
const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');
const { spawn } = require('child_process');

let backendProcess;

function startBackend() {
  let nodePath;
  if (process.platform === 'win32') {
    if (app.isPackaged) {
      nodePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'node.exe');
    } else {
      nodePath = 'node.exe';
    }
  } else {
    nodePath = 'node';
  }

  let backendScript;
  let backendCwd;
  if (process.platform === 'win32' && app.isPackaged) {
    backendScript = path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'backend', 'dist', 'main.js');
    backendCwd = path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'backend');
  } else {
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
```
