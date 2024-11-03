import { useContext, useEffect, useRef } from 'react';
import styles from './dropdown.module.scss';
import { PageContext } from '@/hooks/context/page/PageContext';
import { LuTrash } from 'react-icons/lu';
import { IoFolderOpenOutline, IoOpenOutline } from 'react-icons/io5';
import { CiEdit, CiExport } from 'react-icons/ci';
import { handleDeleteFile, handleOpenFileFolder } from '@/utils/handles';

interface DropdownProps {
    id: string;
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
    const { openDropdownId, toggleDropdown, togglePdfModal, fileData, files, setFiles } = context;

    if (openDropdownId !== id) return null;

    const handleClick = (action: string) => {
        toggleDropdown(id);
        if (action === 'get-file') {
            togglePdfModal();
            toggleDropdown('');
        } else if (action === 'open-file-folder') {
            handleOpenFileFolder(fileData)
        } else if (action === 'delete') {
            handleDeleteFile(fileData).then((result) => {
                const updatedFiles = files.filter(f => f.path !== result.path);
                setFiles(updatedFiles);
            })
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
