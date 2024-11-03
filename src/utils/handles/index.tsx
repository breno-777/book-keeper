import { PageContext } from "@/hooks/context/page/PageContext";
import { IFile } from "@/interfaces/files.interface";
import { useContext } from "react";

export async function handleOpenFileFolder(file: IFile | null) {
    await window.electron.on('open-file-explorer', file);
}

export async function handleDeleteFile(file: IFile | null) {
    try {
        const result = await window.electron.on('delete-file', file);
        return result;
    } catch (error) {
        console.error(error);
    }
}