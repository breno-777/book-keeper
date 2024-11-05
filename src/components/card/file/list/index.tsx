import { IoMdMore } from 'react-icons/io';
import styles from './list.module.scss';
import { IFile } from '@/interfaces/files.interface';
import { Dropdown } from '@/components/dropdown';
import { useContext } from 'react';
import { PageContext } from '@/hooks/context/page/PageContext';
import Image from 'next/image';

import txtIcom from '@assets/icons/files/txt.svg'
import docIcom from '@assets/icons/files/doc.svg'
import pdfIcom from '@assets/icons/files/pdf.svg'
import pptIcom from '@assets/icons/files/ppt.svg'
import pngIcom from '@assets/icons/files/png.svg'
import jpgIcom from '@assets/icons/files/jpg.svg'

export const ListFileCard = ({ file }: { file: IFile }) => {
    const context = useContext(PageContext);
    if (!context || !file) return null;

    const truncateString = (str: string, maxLength: number) => {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + '...';
        }
        return str;
    };
    const truncatedString = truncateString(file.name, 32);

    const { toggleDropdown, setFileData, togglePdfModal } = context;
    const uniqueId = file.name.toLowerCase().replace(/\s+/g, '-');

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
                <div className={styles.file_details_container}>
                    <div className={styles.icon_container}>
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
                        <p className={styles.file_name}>{truncatedString || 'File name here'}</p>
                    </div>
                    <div className={styles.file_date}>
                        {file.last_modified || '00/00/00'}
                    </div>
                    <div className={styles.details}>
                        <p>{file.size || '0.0kb'}</p>
                        <p>.{file.extension || 'pdf'}</p>
                        <IoMdMore
                            size={20}
                            onClick={handleOpenDropdown}
                            className={styles.open_dropdown_button}
                        />
                    </div>
                </div>
            </div>
            <Dropdown id={uniqueId} />
        </div>
    );
};
