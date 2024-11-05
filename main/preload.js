/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(('electron'), {
    on: (channel, data) => ipcRenderer.invoke(channel, data),

    startFunction: (channel) => ipcRenderer.invoke(channel),
    getAllBooks: (channel, data, currentPage, maxFilesPerPage) => ipcRenderer.invoke(channel, data, currentPage, maxFilesPerPage),
    createUser: (channel, data) => ipcRenderer.invoke(channel, data),
    getUser: (channel, data) => ipcRenderer.invoke(channel, data),
    getAllUsers: (channel, data) => ipcRenderer.invoke(channel, data),
});
