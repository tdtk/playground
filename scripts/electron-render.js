const { app, BrowserWindow } = require('electron')

let win

function createWindow() {
  //ウインドウの作成
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, //Electron6から必要らしい
    }
  })

  //ウインドウに表示する内容
  win.loadFile('index.html')

  //ウインドウが閉じられたとき
  win.on('closed', () => {
    win = null
  })
}

//アプリが初期化されたとき（起動されたとき）
app.on('ready', () => {
  createWindow();
})

//全ウインドウが閉じられたとき
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//アクティブになったとき（MacだとDockがクリックされたとき）
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
