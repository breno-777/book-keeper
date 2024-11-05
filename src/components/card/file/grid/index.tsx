import { IoMdMore } from 'react-icons/io'
import styles from './grid.module.scss'
import { IFile } from '@/interfaces/files.interface'
import { useContext } from 'react';
import { PageContext } from '@/hooks/context/page/PageContext';
import { Dropdown } from '@/components/dropdown';
import Image from 'next/image';

import txtIcom from '@assets/icons/files/txt.svg'
import docIcom from '@assets/icons/files/doc.svg'
import pdfIcom from '@assets/icons/files/pdf.svg'
import pptIcom from '@assets/icons/files/ppt.svg'
import pngIcom from '@assets/icons/files/png.svg'
import jpgIcom from '@assets/icons/files/jpg.svg'

export const GridFileCard = ({ file }: { file: IFile }) => {
    const context = useContext(PageContext);
    if (!context) return null;
    const { toggleDropdown, setFileData, togglePdfModal } = context;

    const uniqueId = file.name.toLowerCase().replace(/\s+/g, '-');

    const truncateString = (str: string, maxLength: number) => {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + '...';
        }
        return str;
    };
    const truncatedString = truncateString(file.name, 34);

    const handleOpenDropdown = (event: React.MouseEvent) => {
        event.stopPropagation();
        toggleDropdown(uniqueId);
        setFileData(file);
    };

    const handleCardClick = () => {
        togglePdfModal();
        setFileData(file);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div className={styles.container} onClick={handleCardClick}>
                <div className={styles.file_preview_container}>
                    <Image
                        src={
                            file.extension === 'pdf' ? pdfIcom :
                                file.extension === 'txt' ? txtIcom :
                                    file.extension === 'doc' ? docIcom :
                                        file.extension === 'ppt' ? pptIcom :
                                            file.extension === 'png' ? pngIcom : jpgIcom
                        }
                        alt='file_icon'
                        className={styles.file_icon}
                    />
                </div>
                <p className={styles.file_name}>{file.name ? truncatedString : 'File name here'}</p>
                <div className={styles.divider} />
                <div className={styles.file_details_container}>
                    <div className={styles.details}>
                        <p> {file.size ? file.size : '0.0kb'}</p>
                        <p>.{file.extension ? file.extension : 'pdf'}</p>
                    </div>

                    <IoMdMore
                        size={20}
                        onClick={handleOpenDropdown}
                        className={styles.open_dropdown_button}
                    />
                </div>
            </div>
            <Dropdown id={uniqueId} />
        </div>
    )
}