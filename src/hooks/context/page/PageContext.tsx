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

    searchFilter: string;
    setSearchFilter: (str: string) => void;

    userId: string;
    setUserId: (data: string) => void;
    user: IUser | null;
    setUser: (data: IUser | null) => void;
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

    const [searchFilter, setSearchFilter] = useState<string>('');

    const [userId, setUserId] = useState<string>('');
    const [user, setUser] = useState<IUser | null>(null);

    const toggleUploadModal = () => setUploadModalOpen((prev) => !prev);
    const togglePdfModal = () => setPdfModalOpen((prev) => !prev);
    const toggleAddUserModal = () => setAddUserModalOpen((prev) => !prev);

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(prev => (prev === id ? '' : id));
    };

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

            searchFilter,
            setSearchFilter,

            userId,
            setUserId,
            user,
            setUser
        }}>
            {children}
        </PageContext.Provider >
    );
};