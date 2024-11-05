/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('node:path');
const { exec } = require('child_process');
const { formatSize } = require('.');

function getFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`File does not exist: ${filePath}`);
            return null;
        }

        const data = fs.readFileSync(filePath);
        console.log(`File read successfully: ${filePath}`);
        return data;
    } catch (error) {
        console.error(`Error reading file: ${filePath}`, error);
        return null;
    }
}

function getAllFiles(directoryPath) {
    const files = [];
    const fileList = fs.readdirSync(directoryPath);

    for (const file of fileList) {
        const filePath = path.join(directoryPath, file);
        const size = fs.statSync(filePath).size;
        const last_modified = fs.statSync(filePath).mtime;
        const extension = file.substring(file.lastIndexOf('.') + 1);

        const formattedLastModified = new Date(last_modified).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        files.push({
            name: file,                             // File name
            path: filePath,                         // Full File path
            size: formatSize(size),                 // File size
            last_modified: formattedLastModified,   // File size
            extension: extension,                   // File extension
        });

        if (fs.statSync(filePath).isDirectory()) {
            files.push(...getAllFiles(filePath));
        }
    }
    return files;
}

async function saveFile(directoryPath, file, userId) {
    try {
        fs.writeFileSync(directoryPath, file)
        console.log('File copied successfully');
        const savedFile = {
            name: path.basename(directoryPath),
            path: directoryPath,
            size: formatSize(fs.statSync(directoryPath).size),
            last_modified: new Date().toLocaleString('pt-BR'),
            extension: path.extname(directoryPath).slice(1),
            userId: userId
        };

        return savedFile;
    } catch (error) {
        console.error(`Failed to save file to path ${directoryPath} `, error);
        return null;
    }
}


// ————————————————————————————————————————————————————————————————————
// This function is used to open location of file in the explorer
// ————————————————————————————————————————————————————————————————————
function openFileLocation(filePath) {
    if (process.platform === 'win32') {
        // windows
        if (process.platform === 'win32') {
            exec(`explorer.exe /select,"${filePath}"`);
        }
        // macOS
        else if (process.platform === 'darwin') {
            exec(`open -R "${filePath}"`);
        }
        // Linux
        else if (process.platform === 'linux') {
            exec(`xdg-open "${folderPath}"`);
        }
    }
}
// ————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————
async function deleteFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }
    try {
        fs.unlinkSync(filePath);
        console.log(`File deleted: ${filePath}`);
    } catch (error) {
        console.error(`Error deleting file: ${filePath}`, error);
    }
}

module.exports = { openFileLocation, deleteFile, getAllFiles, saveFile, getFile };