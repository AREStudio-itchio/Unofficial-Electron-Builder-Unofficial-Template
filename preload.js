const { contextBridge, ipcRenderer } = require('electron');

// Expone una API segura al contexto del renderizador (index.html)
contextBridge.exposeInMainWorld('electronAPI', {
  // Función que enviará un mensaje al proceso principal para alternar la pantalla completa
  toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen')
});