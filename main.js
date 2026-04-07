const { app, Tray, Menu } = require('electron');

let tray = null;

app.on('ready', () => {
  tray = new Tray('path/to/icon.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: () => { app.quit(); }}
  ]);
  tray.setToolTip('VocalFlow');
  tray.setContextMenu(contextMenu);
});
