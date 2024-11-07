import { RxCardStack } from 'react-icons/rx';
import styles from './sidebar.module.scss'
import { LuHistory, LuTrash } from 'react-icons/lu';
import { TbSettings2 } from 'react-icons/tb';
import { PageContext } from '@/hooks/context/page/PageContext';
import { useContext } from 'react';
import { CgFileAdd } from 'react-icons/cg';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { SidebarItem } from './section';

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

                    onClick={() => handleClick('all-books')}
                >
                    <SidebarItem
                        selected={currentPage === 'all-books'}
                        title='All Books' icon={<RxCardStack size={16} />} arrow />
                </li>
                <li onClick={() => toggleUploadModal()}>
                    <SidebarItem title='New File' icon={<CgFileAdd size={16} />} />
                </li>
                <li
                    onClick={() => handleClick('trash')}
                >
                    <SidebarItem
                        selected={currentPage === 'trash'}
                        title='Trash' icon={<LuTrash size={16} />} arrow />
                </li>
                <div className={styles.divider} />
                <li>
                    <SidebarItem title='Recent' icon={<LuHistory size={16} />} submenu arrow />
                </li>
                <div className={styles.bottom}>
                    <li
                        onClick={() => handleClick('settings')}
                    >
                        <SidebarItem
                            selected={currentPage === 'settings'}
                            title='Settings' icon={<TbSettings2 size={16} />} arrow />
                    </li>
                    <li
                        onClick={() => handleClick('apis')}
                    >
                        <SidebarItem
                            selected={currentPage === 'apis'}
                            title='APIs' icon={<HiOutlineWrenchScrewdriver size={16} />} arrow />
                    </li>
                </div>
            </ul>
        </div>
    );
}