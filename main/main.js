/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('node:path');
const fs = require('fs');

const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const pdfWorkerPath = path.join(pdfjsDistPath, 'build', 'pdf.worker.mjs');
fs.cpSync(pdfWorkerPath, './dist/pdf.worker.mjs', { recursive: true });

const { initialize } = require('./utils/initialize');
const { createDirectory } = require('./utils/directories');
const { saveFile, deleteFile, getFile, openFileLocation, getAllFiles } = require('./utils/files');


// Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;
const userDocuments = app.getPath('documents');
let rootFolder;
let usersFolder;
let booksFolderPath;

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

    ipcMain.handle('get-current-version', async () => {
        try {
            const data = await fs.readFileSync('./package.json', 'utf8');
            const packageJson = JSON.parse(data);
            return packageJson.version;
        } catch (err) {
            console.error('Error reading package.json:', err);
            throw err;
        }
    });


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
            console.log(
                `
                Initialization successful!
                Book Keeper folder path:  ${rootFolder.bookKeeperFolder}
                users folder path:  ${rootFolder.usersFolder}
                `
            );
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

        const userFolder = path.join(rootFolder.usersFolder, userId);

        try {
            const userFolderExists = await fs.promises.stat(userFolder);
            if (!userFolderExists.isDirectory()) {
                return { success: false, message: "User folder does not exist." };
            }

            const booksFolderExists = await fs.promises.stat(booksFolderPath);
            if (!booksFolderExists.isDirectory()) {
                return { success: false, message: "Books folder does not exist." };
            }

            return userFolder;
        } catch (error) {
            console.error('Error retrieving user files:', error.message);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('create-user', async (event, userData) => {
        const { id, name } = userData;
        const defaultSettingsContent = fs.readFileSync('./main/settings/settings.json', 'utf8');
        const defaultSettings = JSON.parse(defaultSettingsContent);

        try {
            const userDirPath = await createDirectory(rootFolder.usersFolder, id);

            if (userDirPath) {
                const userFilePath = path.join(userDirPath, 'user.json');
                const booksDirPath = await createDirectory(userDirPath, 'books');
                const userInfo = { id, name, user_path: userDirPath, books_path: booksDirPath, settings: defaultSettings };

                await fs.promises.writeFile(userFilePath, JSON.stringify(userInfo, null, 2), 'utf8');
                console.log(`user.file created successfully on ${userDirPath}`);

                const userContent = JSON.parse(await fs.promises.readFile(userFilePath, 'utf8'));
                return userContent;
            }
        } catch (error) {
            console.error('Error creating user', error.message);
            return { success: false, message: error.message };
        }
    })

    ipcMain.handle('delete-user', async (event, userId) => {
        try {
            if (!userId) {
                return { success: false, message: "User ID is required." };
            }
            const userFolder = path.join(rootFolder.usersFolder, userId);
            fs.rmSync(userFolder, { recursive: true, force: true })
            console.log('User deleted successfully!');

        } catch (error) {
            console.error('Error deleting user', error.message);
        }
    })

    ipcMain.handle('get-all-users', async () => {
        usersFolder = path.join(rootFolder.usersFolder);
        try {
            const userFolders = await fs.promises.readdir(usersFolder, { withFileTypes: true });
            const users = [];
            for (const folder of userFolders) {
                if (folder.isDirectory()) {
                    const userFilePath = path.join(usersFolder, folder.name, 'user.json');

                    try {
                        const userData = await fs.promises.readFile(userFilePath, 'utf8');
                        const userInfo = JSON.parse(userData); users.push(userInfo);
                    } catch (error) {
                        console.error(`Error reading the user.json file for the user ${folder.name}:`, error.message);
                    }
                }
            }
            return users;
        } catch (error) {
            console.error('Error recovering user files:', error.message);
            return { success: false, message: error.message };
        }
    });


    ipcMain.handle('get-books-files', async (event, booksDirPath, currentPage = 1, filesPerPage = 10) => {
        try {
            if (!booksDirPath) {
                throw new Error("Books folder path not initialized!");
            }

            const files = await getAllFiles(booksDirPath);

            const startIndex = (currentPage - 1) * filesPerPage;
            const endIndex = startIndex + filesPerPage;

            const paginatedFiles = files.slice(startIndex, endIndex);

            return {
                files: paginatedFiles,
                totalFiles: files.length,
            };
        } catch (error) {
            console.error('Error in IPC handler for get-books-files:', error);
            throw error;
        }
    });

    ipcMain.handle('save-files', async (event, files) => {
        let savedFiles = [];

        for (const file of files) {
            if (!file.booksDirPath || !file.name) {
                throw new Error('Books Directory Path or file name is missing.')
            }

            const filePath = path.join(file.booksDirPath, file.name);
            if (!file.content || typeof file.content !== 'string') {
                throw new Error('File content is missing or not a valid string.');
            }
            const fileBuffer = Buffer.from(file.content, 'base64');

            const savedFile = await saveFile(filePath, fileBuffer)
            savedFiles.push(savedFile);
        }

        return savedFiles;
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
