import { ReactNode, useContext, useEffect, useRef } from 'react';
import styles from './dropdown.module.scss';
import { PageContext } from '@/hooks/context/page/PageContext';
import { LuTrash } from 'react-icons/lu';
import { IoFolderOpenOutline, IoOpenOutline } from 'react-icons/io5';
import { CiEdit, CiExport } from 'react-icons/ci';
import { handleDeleteFile, handleOpenFileFolder } from '@/utils/handles';
import { IDialogModal } from '@/interfaces/modals.interface';

interface DropdownProps {
    id: string;
    li?: ReactNode[];
}

export const Dropdown = ({ id }: DropdownProps) => {
    const context = useContext(PageContext);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                toggleDropdown(id);
            }
        };
        document.addEventListener('mouseup', handleClickOutside);
        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, [id]);


    if (!context) return null;
    const { openDropdownId, toggleDropdown, togglePdfModal, fileData, files, setFiles, handleSetDialogModalContents, toggleDialogModal } = context;

    if (openDropdownId !== id) return null;

    const modalDialogContents: IDialogModal = {
        title: 'Delete File',
        message: `Are you sure you want to delete the file "${fileData?.name}"?`,
        details: 'File Path: C:/breno/documents/BookKeeper/books/file_name',
        confirmButtonText: 'Yes, Delete!',
        dismissButtonText: 'No, Keep it.',
        dismissButtonVariant: 'danger',
        onConfirm: () => {
            handleDeleteFile(fileData).then((result) => {
                const updatedFiles = files.filter(f => f.path !== result.path);
                setFiles(updatedFiles);
            });
            toggleDialogModal();
        },
        onDismiss: () => {
            toggleDialogModal();
        },
    }

    const handleOpenDialogModal = () => {
        handleSetDialogModalContents(modalDialogContents);
        toggleDialogModal();
    }

    const handleClick = (action: string) => {
        toggleDropdown(id);
        if (action === 'get-file') {
            togglePdfModal();
            toggleDropdown('');
        } else if (action === 'open-file-folder') {
            handleOpenFileFolder(fileData)
        } else if (action === 'delete') {
            handleOpenDialogModal();
        }
    }

    return (
        <div ref={dropdownRef} className={styles.container}>
            <ul>
                <li onClick={() => handleClick('get-file')} ><IoOpenOutline size={18} />Open</li>
                <li onClick={() => handleClick('open-file-folder')} ><IoFolderOpenOutline size={18} />Open folder</li>
                <li><CiEdit size={18} />Edit</li>
                <li><CiExport size={18} />Export</li>
                <li
                    className={styles.delete_button}
                    onClick={() => handleClick('delete')}
                >
                    <LuTrash size={18} />
                    Delete
                </li>
            </ul>
        </div>
    );
};
