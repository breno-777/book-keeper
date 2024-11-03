'use client'

import styles from './pdf.module.scss';

import { Button } from '@/components/buttons';
import { PageContext } from '@/hooks/context/page/PageContext';
import { useContext, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { ImPagebreak, ImPageBreak } from 'react-icons/im';
import { IoCloseOutline } from 'react-icons/io5';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer() {
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [openPages, setOpenPages] = useState<boolean>(true);
    const [, setIsFileLoaded] = useState<boolean>(false);

    const context = useContext(PageContext);

    useEffect(() => {
        if (context && context.fileData && context.isPdfModalOpen) {
            const loadFile = async () => {
                try {
                    const base64Data = await window.electron.on('get-file', context.fileData);
                    if (base64Data) {
                        setPdfData(`data:application/pdf;base64,${base64Data}`);
                        setIsFileLoaded(true);
                    } else {
                        console.error('Failed to load PDF data');
                    }
                } catch (error) {
                    console.error('Error loading PDF:', error);
                }
            };
            loadFile();
        } else {
            setPdfData(null);
            setIsFileLoaded(false);
            setNumPages(0);
            setPageNumber(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context?.fileData, context?.isPdfModalOpen]);

    if (!context) return null;

    const { isPdfModalOpen, togglePdfModal } = context;
    if (!isPdfModalOpen) return null;

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const handleNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handlePreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.document_container}>
                <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
                    {openPages ? (
                        Array.from({ length: numPages }, (_, i) => (
                            <Page scale={1.6} key={i} pageNumber={i + 1} renderTextLayer={false} renderAnnotationLayer={false} />
                        ))
                    ) : (
                        <Page scale={1.6}
                            pageNumber={pageNumber}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    )}
                </Document>
            </div>
            {openPages ? (
                <div className={styles.document_footer}>
                    <Button variant='primary' onClick={() => setOpenPages((prev) => !prev)}>
                        {openPages ? <ImPageBreak size={18} /> : <ImPagebreak size={18} />}
                    </Button>
                    <Button variant='primary' onClick={() => togglePdfModal()}><IoCloseOutline size={18} /></Button>
                </div>
            ) : (
                <div className={styles.document_footer}>
                    <Button variant='primary' onClick={() => setOpenPages((prev) => !prev)}>
                        {openPages ? <ImPageBreak size={18} /> : <ImPagebreak size={18} />}
                    </Button>
                    <Button variant='primary' onClick={handlePreviousPage} outline={pageNumber <= 1}><HiOutlineArrowLeft size={18} /></Button>
                    Page {pageNumber} of {numPages}
                    <Button variant='primary' onClick={handleNextPage} outline={pageNumber >= numPages}><HiOutlineArrowRight size={18} /></Button>
                    <Button variant='primary' onClick={() => togglePdfModal()}><IoCloseOutline size={18} /></Button>
                </div>
            )}
        </div>
    );
}

export default PdfViewer;
