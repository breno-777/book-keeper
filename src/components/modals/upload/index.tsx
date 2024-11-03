import { useCallback, useContext, useEffect, useState } from 'react';
import styles from './upload.module.scss';
import { PageContext } from '@/hooks/context/page/PageContext';
import { Button } from '@/components/buttons';
import { LuTrash } from 'react-icons/lu';
import { LiaCloudUploadAltSolid } from 'react-icons/lia';
import { useDropzone } from 'react-dropzone';

type FileData = {
    name: string;
    content: string;
    userId: string | null;
};

export const UploadModal = () => {
    const context = useContext(PageContext);
    const [fileData, setFileData] = useState<FileData | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            console.error('Please upload a PDF file.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('File reading was aborted');
        reader.onerror = () => console.log('File reading failed');

        reader.onload = () => {
            const base64Data = (reader.result as string).split(',')[1];
            setFileData({ name: file.name, content: base64Data, userId: localStorage.getItem('userId') });
        };

    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': [] },
    });

    useEffect(() => {
        return () => setFileData(null);
    }, [context?.isUploadModalOpen]);

    if (!context) return null;
    const { isUploadModalOpen, toggleUploadModal, setFiles, files } = context;
    if (!isUploadModalOpen) return null;

    const handleSaveFile = async () => {
        if (fileData) {
            await window.electron.on('save-file', fileData).then((result) => {
                setFiles([...files, result]);
                toggleUploadModal()
            });
        } else {
            console.error("No files selected.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.modal_container}>
                <p className={styles.title}>Add new file</p>
                <input type="text" placeholder='File Name' defaultValue={fileData?.name.split('.').slice(0, -1).join('.')} />

                <div className={styles.upload_file_area_container} {...getRootProps()}>
                    <LiaCloudUploadAltSolid size={96} />
                    <input {...getInputProps()} />
                    <p>{isDragActive ? 'Drop the file here...' : 'Browse file to upload!'}</p>
                </div>

                <div className={styles.footer_container}>
                    <Button outline onClick={() => toggleUploadModal()}>Cancel</Button>
                    <div className={styles.selected_file_details_container}>
                        {fileData ? fileData.name.slice(0, 28) + '...' : 'No file selected'}
                        <LuTrash size={16} className={styles.remove_file_icon} onClick={() => setFileData(null)} />
                    </div>
                    <Button variant='primary' onClick={() => handleSaveFile()}>Save</Button>
                </div>
            </div>
        </div>
    );
};
