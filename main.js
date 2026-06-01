require("electron-reload")(__dirname);

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 280,
        height: 400,

        resizable: false,
        maximizable: false,
        fullscreenable: false,

        frame: false,

        transparent: true,
        backgroundColor: "#00000000",

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile("index.html");

    // Uncomment for debugging
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
});

ipcMain.on("window-minimize", () => {
    if (win) win.minimize();
});

ipcMain.on("window-close", () => {
    if (win) win.close();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});