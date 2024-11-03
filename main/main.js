/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const path = require('node:path');
const fs = require('fs');

const { initialize } = require('./utils/initialize');
const { createDirectory } = require('./utils/directories');
const { saveFile, deleteFile, getFile, openFileLocation, getFiles } = require('./utils/files');

const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const pdfWorkerPath = path.join(pdfjsDistPath, 'build', 'pdf.worker.mjs');
fs.cpSync(pdfWorkerPath, './dist/pdf.worker.mjs', { recursive: true });

// Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;
let booksFolderPath;
const userDocuments = app.getPath('documents');
let rootFolder;
let usersFolder;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        minWidth: 940,
        minHeight: 500,
        width: 1280,
        height: 720,
        webPreferences: {
            webSecurity: true,
            preload: path.join(__dirname, 'preload.js'),
            // contextIsolation: true,
            // enableRemoteModule: false
        }
    });

    const url = 'http://localhost:3000';
    mainWindow.loadURL(url);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    createWindow();

    ipcMain.handle('get-current-version', () => {
        fs.readFile('./package.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading package.json:', err);
                throw err;
            }
            const packageJson = JSON.parse(data);
            return packageJson.version;
        })
    })

    ipcMain.handle('check-for-updates', async () => {
        try {
            autoUpdater.checkForUpdates();
        } catch (error) {
            console.error('Error in IPC handler for check-for-updates:', error);
            throw error;
        }
    })

    ipcMain.handle('check-necessary-directories', async () => {
        try {
            const result = await initialize(userDocuments);

            rootFolder = result;
            console.log('Initialization successful. Book Keeper path:', rootFolder);
        } catch (error) {
            console.error('Couldn\'t initialize:', error.message);
            dialog.showMessageBox(mainWindow, {
                type: "error",
                title: "Initialization Error",
                message: "An error occurred while initializing the application. Check the logs for more information."
            });
            app.quit();
        }
    });

    ipcMain.handle('get-user', async (event, userId) => {
        if (!userId) {
            return { success: false, message: "User ID is required." };
        }
        usersFolder = path.join(rootFolder, 'users');

        try {
            const userFolder = await fs.promises.readdir(usersFolder, userId);
            return userFolder;
        } catch (error) {
            console.error('Error retrieving user files:', error.message);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('get-all-users', async () => {
        usersFolder = path.join(rootFolder, 'users');
        try {
            const userFolders = await fs.promises.readdir(usersFolder, { withFileTypes: true });
            const users = [];
            for (const folder of userFolders) {
                if (folder.isDirectory()) {
                    const userFilePath = path.join(usersFolder, folder.name, 'user.json');

                    try {
                        const userData = await fs.promises.readFile(userFilePath, 'utf8');
                        const userInfo = JSON.parse(userData);
                        users.push(userInfo);
                    } catch (error) {
                        console.error(`Erro ao ler o arquivo user.json para o usuário ${folder.name}:`, error.message);
                    }
                }
            }
            return users;
        } catch (error) {
            console.error('Erro ao recuperar arquivos de usuários:', error.message);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('create-user', async (event, userData) => {
        const { id, name, folder_name } = userData;
        const rootPath = path.join(rootFolder, 'users');

        try {
            const userDirPath = await createDirectory(rootPath, folder_name);

            if (userDirPath) {
                const userFilePath = path.join(userDirPath, 'user.json');

                const userInfo = { id, name, folder_name };

                await fs.promises.writeFile(userFilePath, JSON.stringify(userInfo, null, 2), 'utf8');
                console.log(`user.file created successfully on ${userDirPath}`);

                await createDirectory(userDirPath, 'books');

                return { success: true, message: 'User created successfully!' }
            }
        } catch (error) {
            console.error('Error creating user', error.message);
            return { success: false, message: error.message };
        }
    })

    ipcMain.handle('get-books-files', async () => {
        try {
            if (!booksFolderPath) {
                throw new Error("Books folder path not initialized!");
            }
            const files = await getFiles(booksFolderPath);
            return files;
        } catch (error) {
            console.error('Error in IPC handler for get-books-files:', error);
            throw error;
        }
    });

    ipcMain.handle('save-file', async (event, file) => {
        if (!file.userId || !file.name) {
            throw new Error('User ID or file name is missing.')
        }

        const filePath = path.join(rootFolder, 'users', file.userId, 'books', file.name);
        if (!file.content || typeof file.content !== 'string') {
            throw new Error('File content is missing or not a valid string.');
        }
        const fileBuffer = Buffer.from(file.content, 'base64');

        const savedFile = await saveFile(filePath, fileBuffer, file.userId);
        return savedFile;
    });

    ipcMain.handle('delete-file', async (event, file) => {
        try {
            const fileToDelete = file;
            await deleteFile(file.path);
            return fileToDelete;
        } catch (error) {
            console.error('Error in IPC handler for delete-file:', error);
            throw error;
        }
    })

    ipcMain.handle('get-file', async (event, file) => {

        const fileBuffer = getFile(file.path);
        if (fileBuffer) {
            return fileBuffer.toString('base64');
        }
        return null;
    });

    ipcMain.handle('open-file-explorer', (event, file) => {
        openFileLocation(file.path);
    })

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
