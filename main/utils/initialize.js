/* eslint-disable @typescript-eslint/no-require-imports */
const { checkDirectory, createDirectory } = require("./directories");

async function initialize(rootFolder) {
    if (!rootFolder) {
        throw new Error("The 'rootFolder' is required for initialization.");
    }
    try {
        const bookKeeperFolder = await checkDirectory(rootFolder, 'Book Keeper');
        if (!bookKeeperFolder) {
            bookKeeperFolder = await createDirectory(rootFolder, 'Book Keeper');
            console.log("'Book Keeper' directory created.");
            return bookKeeperFolder;
        } else {
            console.log("'Book Keeper' directory already exists.");
            return bookKeeperFolder;
        }

    } catch (error) {
        console.error('Initialization failed:', error.message);
        throw error;
    }
}

async function loadUserData(userPath) {
    if (!userPath) {
        throw new Error("The 'userPath' are required for loading user data.");
    }

    try {
        await checkDirectory(booksFolder, 'books');
        console.log('Initialization of user data completed.');

        return { backupFolder, booksFolder }
    } catch (error) {
        console.error('Failed to initialize user data');

        throw error;
    }
}

module.exports = { initialize, loadUserData };