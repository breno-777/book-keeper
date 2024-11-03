import { RxCardStack } from 'react-icons/rx';
import styles from './sidebar.module.scss'
import { IoIosArrowForward } from 'react-icons/io';
import { BsFilePlus } from 'react-icons/bs';
import { LuHistory, LuTrash } from 'react-icons/lu';
import { TbSettings2 } from 'react-icons/tb';
import { PageContext } from '@/hooks/context/page/PageContext';
import { useContext } from 'react';

export const SideBar = () => {
    const context = useContext(PageContext);
    if (!context) return null;

    const { currentPage, setCurrentPage, toggleUploadModal } = context;
    const handleClick = (page: string) => {
        setCurrentPage(page)
    };

    return (
        <div className={styles.container}>
            <p className={styles.title}>Book Keeper</p>
            <ul className={styles.list}>
                <li
                    className={currentPage === 'all-books' ? styles.selected : ''}
                    onClick={() => handleClick('all-books')}
                >
                    <div className={styles.section_container}>
                        <RxCardStack size={16} />
                        <p>All Books</p>
                    </div>
                    <IoIosArrowForward size={16} />
                </li>
                <li onClick={() => toggleUploadModal()}>
                    <div className={styles.section_container}>
                        <BsFilePlus size={16} />
                        <p>New File</p>
                    </div>
                </li>
                <li
                    className={currentPage === 'trash' ? styles.selected : ''}
                    onClick={() => handleClick('trash')}
                >
                    <div className={styles.section_container}>
                        <LuTrash size={16} />
                        <p>Trash</p>
                    </div>
                    <IoIosArrowForward size={16} />
                </li>
                <div className={styles.divider} />
                <li>
                    <div className={styles.section_container}>
                        <LuHistory size={16} />
                        <p>Recent</p>
                    </div>
                    <IoIosArrowForward size={16} />
                </li>
                <li
                    className={currentPage === 'settings' ? styles.selected : ''}
                    onClick={() => handleClick('settings')}
                >
                    <div className={styles.section_container}>
                        <TbSettings2 size={16} />
                        <p>Settings</p>
                    </div>
                    <IoIosArrowForward size={16} />
                </li>
            </ul>
        </div>
    );
}