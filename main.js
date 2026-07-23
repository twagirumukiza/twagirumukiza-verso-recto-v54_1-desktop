const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");

// Garde une référence globale de la fenêtre pour éviter qu'elle soit
// détruite par le ramasse-miettes JS.
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#181c24",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      // Le jeu est un simple HTML/CSS/JS statique (+ Firebase compat via CDN
      // pour le mode en ligne) : pas besoin de Node dans la page, on isole.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));

  // Les liens qui sortent de l'application (http/https externes autres que
  // Firebase, mentions légales, etc.) s'ouvrent dans le navigateur système
  // plutôt que dans une nouvelle fenêtre Electron.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Menu minimal (la barre est de toute façon masquée par autoHideMenuBar,
  // Alt l'affiche ponctuellement) : on garde juste Quitter / Rechargement /
  // Zoom / DevTools pour le confort de débogage.
  const template = [
    {
      label: "Verso Recto",
      submenu: [{ role: "reload" }, { role: "toggledevtools" }, { type: "separator" }, { role: "quit" }],
    },
    {
      label: "Affichage",
      submenu: [{ role: "resetzoom" }, { role: "zoomin" }, { role: "zoomout" }, { type: "separator" }, { role: "togglefullscreen" }],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
