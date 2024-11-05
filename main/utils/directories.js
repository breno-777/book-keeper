/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

async function checkDirectory(rootPath, directoryName) {
    const directoryPath = path.join(rootPath, directoryName);
    try {
        const stats = fs.statSync(directoryPath);
        if (stats.isDirectory()) {
            return directoryPath;
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

async function createDirectory(rootPath, directoryName) {
    try {
        const exist = await checkDirectory(rootPath, directoryName);
        if (!exist) {
            const folderPath = path.join(rootPath, directoryName)
            await fs.promises.mkdir(folderPath, { recursive: true });
            console.log(`Directory ${directoryName} created at: ${folderPath}`);
            return folderPath;
        } else {
            console.log(`Directory ${directoryName} already exists`);
        }
    } catch (error) {
        console.error('Failed to create directory:', error.message);
        throw error;
    }
}

async function deleteDirectory(rootPath, directoryName) {
    try {
        const exist = await checkDirectory(rootPath, directoryName);
        if (exist) {
            const folderPath = path.join(rootPath, directoryName);
            await fs.promises.rmdir(folderPath, { recursive: true });
            console.log(`Directory ${directoryName} deleted successfully!`);
        } else {
            console.log(`Directory ${directoryName} does not exist`);
        }
    } catch (error) {
        console.error('Failed to delete directory:', error.message);
        throw error;
    }
}

module.exports = { checkDirectory, createDirectory, deleteDirectory };