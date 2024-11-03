/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(('electron'), {
    on: (channel, file) => ipcRenderer.invoke(channel, file),

    startFunction: (channel) => ipcRenderer.invoke(channel),
    getAllBooks: (channel, data) => ipcRenderer.invoke(channel, data),
    createUser: (channel, data) => ipcRenderer.invoke(channel, data),
    getUser: (channel, data) => ipcRenderer.invoke(channel, data),
    getAllUsers: (channel, data) => ipcRenderer.invoke(channel, data),
});
