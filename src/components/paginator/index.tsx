import React, { useContext } from 'react';
import styles from './paginator.module.scss'
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { PageContext } from '@/hooks/context/page/PageContext';

interface PaginationProps {
    totalPages: number;
}

const Pagination = ({ totalPages }: PaginationProps) => {
    const context = useContext(PageContext);
    const currentPage = context?.paginatorCurrentPage || 1;
    const pageRange = 6;
    const startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    const endPage = Math.min(startPage + pageRange - 1, totalPages);

    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const handleClick = (page: number) => {
        context?.setPaginatorCurrentPage(page);
    };

    return (
        <div className={styles.container}>
            <button
                disabled={currentPage === 1}
                onClick={() => handleClick(currentPage - 1)}
            >
                <SlArrowLeft />
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => handleClick(page)}
                    className={`${page === currentPage && styles.active}`}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    <span>...</span>
                    <button onClick={() => handleClick(totalPages)}>{totalPages}</button>
                </>
            )}

            <button
                className={styles.icon}
                disabled={currentPage === totalPages}
                onClick={() => handleClick(currentPage + 1)}
            >
                <SlArrowRight />
            </button>
        </div>
    );
};

export default Pagination;
