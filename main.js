const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { spawn, execFile } = require('child_process');


// Execute a Python script
const path = require('path')
const url = require('url')

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreen: true, // Set fullscreen to true
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'gui/gui.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools();
    // Add the custom menu item
    const appMenu = Menu.buildFromTemplate([{
        label: 'File',
        submenu: [{
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                app.quit();
            }
        }]
    }]);

    Menu.setApplicationMenu(appMenu);
}
let script1;
ipcMain.on('run-script', (event, scriptName, jsonData) => {
    switch (scriptName) {
        case 'start':
            console.log(`Started`);
            script1 = spawn('python', ['C:/rtgs/receive.py']);
            script1.stdout.on('data', (data) => {
                console.log(`Script 1 output: ${data}`);
            });
            break;
        case 'pyro':
            const script2 = spawn('python', ['C:/rtgs/pyro.py']);
            script2.stdout.on('data', (data) => {
                console.log(`Script 2 output: ${data}`);
            });
            break;
        case 'stop':
            if (script1) {
                script1.kill();
                script1 = undefined; // Reset the script1 variable
            }
            break;
        case 'savesettings':
            const script3 = spawn('python', ['C:/rtgs/settings.py']);
            const jsonString = JSON.stringify(jsonData);

            // Send JSON data to the Python process
            script3.stdin.write(jsonString);
            script3.stdin.end();
            script3.stdout.on('data', (data) => {
                console.log(`Script 3 output: ${data}`);
                event.sender.send('script-done');
            });
            break;
    }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q

    app.quit()
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.