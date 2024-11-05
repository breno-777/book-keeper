/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
// ————————————————————————————————————————————————————————————————————
// This function is responsible for converting
// the file size into storage units
// ————————————————————————————————————————————————————————————————————
function formatSize(bytes) {
    const sizes = ['Bytes', 'kb', 'mb', 'gb', 'tb'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

async function getUsers(usersPath) {
    try {
        const userFolders = await fs.promises.readdir(usersPath, { withFileTypes: true });
        const users = [];

        for (const folder of userFolders) {
            if (folder.isDirectory()) {
                const userFilePath = path.join(usersPath, folder.name, 'user.json');

                try {
                    const userData = await fs.promises.readFile(userFilePath, 'utf8');
                    const userInfo = JSON.parse(userData);
                    users.push(userInfo);
                } catch (err) {
                    console.error(`Failed to read user file for ${folder.name}:`, err.message);
                }
            }
        }
        return users;
    } catch (error) {
        console.error('Error reading user directories:', error.message);
        throw error;
    }
}

module.exports = { formatSize, getUsers };