/* eslint-disable @typescript-eslint/no-require-imports */
const { checkDirectory, createDirectory } = require("./directories");

async function createNecessaryDirectory(directoryPath, directoryName) {
    let folder;
    if (!directoryPath || !directoryName) {
        throw new Error("The 'directoryPath' or 'directoryName' is required for initialization.");
    }
    try {
        folder = await checkDirectory(directoryPath, directoryName);
        if (!folder) {
            folder = await createDirectory(directoryPath, directoryName);
            console.log(`${directoryName} directory created.`);
            return folder;
        } else {
            console.log(`${directoryName} directory already exists.`);
            return folder;
        }
    } catch (error) {
        console.error('Initialization failed:', error.message);
        throw error;
    }
}

async function initialize(rootFolder) {
    if (!rootFolder) {
        throw new Error("The 'rootFolder' is required for initialization.");
    }
    try {
        let bookKeeperFolder = await createNecessaryDirectory(rootFolder, 'Book Keeper');
        let usersFolder = await createNecessaryDirectory(bookKeeperFolder, 'users');

        if (!bookKeeperFolder || !usersFolder) {
            throw new Error("The 'book keeper folder' or 'users folder' is required for initialization.");
        }
        return { bookKeeperFolder, usersFolder }
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