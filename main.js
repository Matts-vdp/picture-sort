// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs');

//make and initialize main window
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('index.html')
}

//show window when app ready
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

//quit app when all windows are closed except on apple
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

//handle events from the renderer for the 
//minimize maximize unmaximise and close buttons
ipcMain.on("minimize", (event,arg) => {
  let win = BrowserWindow.getFocusedWindow();
  win.minimize()
});
ipcMain.on("maximize", (event,arg) => {
  let win = BrowserWindow.getFocusedWindow();
  win.maximize()
});
ipcMain.on("restore", (event,arg) => {
  let win = BrowserWindow.getFocusedWindow();
  win.unmaximize()
});
ipcMain.on("close", (event,arg) => {
  let win = BrowserWindow.getFocusedWindow();
  win.close()
});

//open a folder select dialog and make a Good, Not-sure, Bad folder in the selected folder
//sends a reply to the renderer with the path to the folder
ipcMain.on('select-dirs', async (event, arg) => {
  try {
    const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
      properties: ['openDirectory']
    })
    fs.mkdir(result.filePaths[0]+"/Bad", (err) =>{if(err){return;}});
    fs.mkdir(result.filePaths[0]+"/Not-sure", (err) =>{if(err){return;}});
    fs.mkdir(result.filePaths[0]+"/Good", (err) =>{if(err){return;}});
    event.reply("send-dir", result.filePaths[0]);
  } catch (error) {
    console.error(error);
  }
  
})