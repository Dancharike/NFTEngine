const {app, BrowserWindow, screen} = require("electron");
const path = require("path");

app.commandLine.appendSwitch("disable-frame-rate-limit");
app.commandLine.appendSwitch("disable-gpu-vsync");

app.commandLine.appendSwitch("disable-features", "PointerLockOptions");
app.commandLine.appendSwitch("disable-blink-features", "AutomationControlled");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

function createWindow()
{
    const primaryDisplay = screen.getPrimaryDisplay();
    const {width, height} = primaryDisplay.workAreaSize;

    const win = new BrowserWindow({
        width: width,
        height: height,
        fullscreen: true,
        alwaysOnTop: false,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: "#000000",
        show: false
    });

    win.once("ready-to-show", () => {win.show();});

    const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

    if(isDev)
    {
        win.loadURL("http://localhost:8080");
        win.webContents.openDevTools();
    }
    else
    {
        win.loadFile(path.join(__dirname, "../dist/index.html"));
    }

    win.webContents.on("before-input-event", (event, input) => {
        if(input.alt && input.key === "F4")              {app.quit();}
        if(input.key === "F12")                          {win.webContents.toggleDevTools(); }
        if(input.key === "F11")                          {win.setFullScreen(!win.isFullScreen());}
        if(input.key === "Escape" && win.isFullScreen()) {win.setFullScreen(false);}
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {app.quit();}
});

app.on("activate", () => {
    if(BrowserWindow.getAllWindows().length === 0) {createWindow();}
});
