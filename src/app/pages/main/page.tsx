import React, { useContext, useState } from 'react';
import styles from './main.module.scss';
import { GridFileCard } from '@/components/modals/card/file/grid';
import { ListFileCard } from '@/components/modals/card/file/list';
import { PageContext } from '@/hooks/context/page/PageContext';
import { HiOutlineInboxStack } from 'react-icons/hi2';
import { BsGrid, BsList } from 'react-icons/bs';

export default function Main() {
    const context = useContext(PageContext);
    const [gridLayout, setGridLayout] = useState<boolean>(false);

    if (!context) return null;
    const { files, searchFilter } = context;

    if (!files) {
        return <p>Loading...</p>;
    }
    
    const filteredFiles = searchFilter
        ? files.filter(file => file.name.toLowerCase().includes(searchFilter.toLowerCase()))
        : files;
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.total_files}>Total Books: {files.length}</p>
                <div className={styles.switch_layout_container} onClick={() => setGridLayout(!gridLayout)}>
                    {gridLayout ? <BsList size={22} /> : <BsGrid size={22} />}
                </div>
            </div>

            {files.length === 0 ? (
                <div className={styles.empty_list_container}>
                    <HiOutlineInboxStack size={72} />
                    <p>Empty List</p>
                </div>
            ) : (
                <div className={`${styles.files_container} ${gridLayout ? '' : styles.list}`}>
                    {filteredFiles.map((file, index) =>
                        gridLayout ? (
                            <GridFileCard key={index} file={file} />
                        ) : (
                            <ListFileCard key={index} file={file} />
                        )
                    )}
                </div>
            )}
        </div>
    );
}
