'use client'

import React, { useContext, useEffect, useState } from 'react';
import styles from './main.module.scss';
import { PageContext } from '@/hooks/context/page/PageContext';
import { BsGrid, BsList } from 'react-icons/bs';
import Paginator from '@/components/paginator';
import { GridFileCard } from '@/components/card/file/grid';
import { ListFileCard } from '@/components/card/file/list';
import { HiOutlineInboxStack } from 'react-icons/hi2';

export default function Main() {
    const context = useContext(PageContext);
    const [gridLayout, setGridLayout] = useState<boolean>(false);
    const filesPerPage = 24 ;

    useEffect(() => {
        if (context?.user) {

            const loadUserFiles = async () => {
                try {
                    await window.electron.getAllBooks('get-books-files', context.user?.books_path, paginatorCurrentPage, filesPerPage)
                        .then((response) => {
                            setFiles(response.files);
                            setTotalFiles(response.totalFiles);
                        });
                } catch (error) {
                    console.error('Error loading data:', error);
                }
            }
            loadUserFiles();
        }
    }, [context?.user, context?.paginatorCurrentPage]);

    if (!context) return null;
    const { files, setFiles, searchFilter, paginatorCurrentPage, totalFiles, setTotalFiles } = context;
    const totalPages = Math.ceil(totalFiles / filesPerPage);

    if (!files) {
        return <p>Loading...</p>;
    }

    const filteredFiles = searchFilter
        ? files.filter(file => file.name.toLowerCase().includes(searchFilter.toLowerCase()))
        : files;
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.total_files}>Total Books: {totalFiles}</p>
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

                    <Paginator totalPages={totalPages} />
                </div>
            )}
        </div>
    );
}
