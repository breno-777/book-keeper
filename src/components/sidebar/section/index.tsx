import { CgFileAdd } from 'react-icons/cg';
import styles from './item.module.scss';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { useContext, useState } from 'react';
import Image from 'next/image';

import txtIcom from '@assets/icons/files/txt.svg'
import docIcom from '@assets/icons/files/doc.svg'
import pdfIcom from '@assets/icons/files/pdf.svg'
import pptIcom from '@assets/icons/files/ppt.svg'
import pngIcom from '@assets/icons/files/png.svg'
import jpgIcom from '@assets/icons/files/jpg.svg'
import { PageContext } from '@/hooks/context/page/PageContext';
import { IFile } from '@/interfaces/files.interface';

interface sidebarItemProperties {
    title: string;
    onClick?: () => void;
    selected?: boolean;
    icon?: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    arrow?: boolean;
    submenu?: boolean;
}

export const SidebarItem = ({ title, icon, disabled, submenu, arrow, selected }: sidebarItemProperties) => {
    const context = useContext(PageContext);
    const [showSubmenu, setShowSubmenu] = useState(false);

    if (!context) return null;
    const { recentsFiles, togglePdfModal, setFileData, handleRemoveRecentsFiles } = context;

    const handleItemClick = (file: IFile) => {
        togglePdfModal();
        setFileData(file);
    };

    const handleItemRightClick = (file: IFile) => {
        handleRemoveRecentsFiles(file);
    };

    return (
        <div className={`${styles.container}`}>
            <div
                className={`${styles.item_container} ${disabled && styles.disabled} ${selected && styles.selected} `}
                onClick={(() => recentsFiles && setShowSubmenu((prev) => !prev))}
            >
                <div className={styles.item}>
                    {icon ? icon : <CgFileAdd size={16} />}
                    <p>{title}</p>
                </div>
                {arrow &&
                    (showSubmenu && submenu ? <IoIosArrowDown size={16} /> : <IoIosArrowForward size={16} />)
                }

            </div>

            {submenu && showSubmenu && recentsFiles.length > 0 && (
                <div className={styles.submenu_container}>
                    {recentsFiles.map((item, index) => (
                        < div
                            className={styles.item}
                            key={index}
                            onClick={(() => handleItemClick(item))}
                            onAuxClick={() => handleItemRightClick(item)}>
                            <div className={styles.icon_container}>
                                <Image
                                    src={
                                        item.extension === 'pdf' ? pdfIcom :
                                            item.extension === 'txt' ? txtIcom :
                                                item.extension === 'doc' ? docIcom :
                                                    item.extension === 'ppt' ? pptIcom :
                                                        item.extension === 'png' ? pngIcom : jpgIcom
                                    }
                                    alt='file_icon'
                                    className={styles.file_icon}
                                />
                            </div>
                            <p className={styles.file_name}>{item.name}</p>
                        </div>
                    ))
                    }
                </div >
            )
            }
        </div >
    )
}