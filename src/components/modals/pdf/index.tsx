'use client'

import styles from './pdf.module.scss';

import { Button } from '@/components/buttons';
import { PageContext } from '@/hooks/context/page/PageContext';
import { useContext, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { BsFileArrowDown, BsFileBreak } from 'react-icons/bs';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer() {
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [openPages, setOpenPages] = useState<boolean>(true);
    const [, setIsFileLoaded] = useState<boolean>(false);
    const [documentScale, setDocumentScale] = useState<number>(1);

    const context = useContext(PageContext);

    useEffect(() => {
        const handleDocumentScale = (event: WheelEvent) => {
            if (event.ctrlKey) {
                if (event.deltaY < 0) {
                    if (documentScale < 4) { setDocumentScale(documentScale + 0.1) }
                } else if (event.deltaY > 0) {
                    if (documentScale >= 0.4) { setDocumentScale(documentScale - 0.1) }
                }
            }
        };
        window.addEventListener('wheel', handleDocumentScale);
        return () => {
            window.removeEventListener('wheel', handleDocumentScale);
        };
    }, [documentScale]);

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
                <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess} >
                    {openPages ? (
                        Array.from({ length: numPages }, (_, i) => (
                            <Page
                                scale={documentScale}
                                key={i}
                                pageNumber={i + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        ))
                    ) : (
                        <Page
                            scale={documentScale}
                            pageNumber={pageNumber}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    )}
                </Document>
            </div>
            <div className={styles.document_footer}>
                <Button variant='primary' onClick={() => setOpenPages((prev) => !prev)}>
                    {openPages ? <BsFileArrowDown size={18} /> : <BsFileBreak size={18} />}
                </Button>

                {!openPages && (
                    <>
                        <Button variant='primary' onClick={handlePreviousPage} outline={pageNumber <= 1}>
                            <HiOutlineArrowLeft size={18} />
                        </Button>
                        Page {pageNumber} of {numPages}
                        <Button variant='primary' onClick={handleNextPage} outline={pageNumber >= numPages}>
                            <HiOutlineArrowRight size={18} />
                        </Button>
                    </>
                )}

                <Button variant='primary' onClick={() => {
                    togglePdfModal()
                    setDocumentScale(1);
                }
                }>
                    <IoClose size={18} />
                </Button>
            </div>
        </div >
    );
}

export default PdfViewer;
