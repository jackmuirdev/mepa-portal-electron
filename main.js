const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the URL and handle errors
  loadURL(win);
}

function loadURL(win) {
  const url = "https://www.portalmepa.co.uk/";

  win.loadURL(url).catch(() => {
    showErrorScreen(win);
  });

  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.log(`Failed to load URL: ${errorCode} - ${errorDescription}`);
    showErrorScreen(win);
  });
}

function showErrorScreen(win) {
  const errorPagePath = path.join(__dirname, "error.html");
  win.loadFile(errorPagePath);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
