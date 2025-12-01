const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

/**
 * Función que crea la ventana principal de la aplicación.
 */
function createWindow() {
  // Crea la ventana del navegador.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // La ventana NO inicia en pantalla completa (modo ventana normal)
    fullscreen: false, 
    webPreferences: {
      // Configuraciones de seguridad clave
      nodeIntegration: false,
      contextIsolation: true,
      // Ruta al script que expone las APIs de comunicación al renderizador
      preload: path.join(__dirname, 'preload.js') 
    }
  });

  // Carga el archivo index.html de la aplicación.
  mainWindow.loadFile('index.html');

  // Opcional: Abre las DevTools (Herramientas de desarrollo)
  // mainWindow.webContents.openDevTools();
}

/**
 * Escuchador de eventos: 
 * Recibe el mensaje 'toggle-fullscreen' desde el proceso de renderizado
 * y alterna el estado de pantalla completa de la ventana actual.
 */
ipcMain.on('toggle-fullscreen', (event) => {
  // Obtiene la ventana que envió el mensaje
  const currentWindow = BrowserWindow.fromWebContents(event.sender);
  
  // Obtiene el estado actual, lo invierte y lo aplica.
  const isFullscreen = currentWindow.isFullScreen();
  currentWindow.setFullScreen(!isFullscreen);
});


// ------------------------------------------------------------------
// Lógica de Ciclo de Vida de la Aplicación
// ------------------------------------------------------------------

// Cuando Electron ha terminado de inicializarse, crea la ventana.
app.whenReady().then(() => {
  createWindow();

  // Gestión de macOS: cuando no hay ventanas abiertas y se hace clic en el ícono del dock.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Sale de la aplicación cuando todas las ventanas están cerradas (excepto en macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});