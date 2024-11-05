"use client"

import { IFile } from "@/interfaces/files.interface";
import { IUser } from "@/interfaces/user.interface";
import { createContext, ReactNode, useState } from "react";

export type PageContextType = {
    currentVersion: string;
    setCurrentVersion: (version: string) => void;
    currentPage: string;
    setCurrentPage: (page: string) => void;

    openDropdownId: string;
    toggleDropdown: (id: string) => void;

    isUploadModalOpen: boolean;
    toggleUploadModal: () => void;

    isPdfModalOpen: boolean;
    togglePdfModal: () => void;

    isAddUserModalOpen: boolean;
    toggleAddUserModal: () => void;

    fileData: IFile | null;
    setFileData: (data: IFile) => void;

    files: IFile[] | [];
    setFiles: (data: IFile[] | []) => void;

    totalFiles: number;
    setTotalFiles: (total: number) => void;

    searchFilter: string;
    setSearchFilter: (str: string) => void;

    user: IUser | null;
    setUser: (data: IUser | null) => void;

    paginatorCurrentPage: number;
    setPaginatorCurrentPage: (page: number) => void;

    clear: () => void;

};

// Context
export const PageContext = createContext<PageContextType | undefined>(undefined);

// Provider
export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentVersion, setCurrentVersion] = useState<string>('0.0.0');
    const [currentPage, setCurrentPage] = useState<string>('all-books');

    const [isUploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
    const [isPdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
    const [isAddUserModalOpen, setAddUserModalOpen] = useState<boolean>(false);

    const [openDropdownId, setOpenDropdownId] = useState<string>('');
    const [fileData, setFileData] = useState<IFile | null>(null);
    const [files, setFiles] = useState<IFile[] | []>([]);
    const [totalFiles, setTotalFiles] = useState<number>(0);

    const [searchFilter, setSearchFilter] = useState<string>('');

    const [user, setUser] = useState<IUser | null>(null);
    const [paginatorCurrentPage, setPaginatorCurrentPage] = useState<number>(1);

    const toggleUploadModal = () => setUploadModalOpen((prev) => !prev);
    const togglePdfModal = () => setPdfModalOpen((prev) => !prev);
    const toggleAddUserModal = () => setAddUserModalOpen((prev) => !prev);

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(prev => (prev === id ? '' : id));
    };

    const clear = () => {
        setCurrentPage('all-books');
        setUploadModalOpen(false);
        setPdfModalOpen(false);
        setAddUserModalOpen(false);
        setOpenDropdownId('');
        setFileData(null);
        setFiles([]);
        setSearchFilter('');
        setUser(null);
        setPaginatorCurrentPage(1);
    }

    return (
        <PageContext.Provider value={{
            currentVersion,
            setCurrentVersion,
            currentPage,
            setCurrentPage,

            isUploadModalOpen,
            toggleUploadModal,
            isPdfModalOpen,
            togglePdfModal,
            isAddUserModalOpen,
            toggleAddUserModal,
            toggleDropdown,

            openDropdownId,
            fileData,
            setFileData,
            files,
            setFiles,

            totalFiles,
            setTotalFiles,

            searchFilter,
            setSearchFilter,

            user,
            setUser,

            paginatorCurrentPage,
            setPaginatorCurrentPage,

            clear
        }}>
            {children}
        </PageContext.Provider >
    );
};