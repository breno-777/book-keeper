import { useCallback, useContext, useEffect, useState } from 'react';
import styles from './upload.module.scss';
import { PageContext } from '@/hooks/context/page/PageContext';
import { Button } from '@/components/buttons';
import { LuTrash } from 'react-icons/lu';
import { LiaCloudUploadAltSolid } from 'react-icons/lia';
import { useDropzone } from 'react-dropzone';
import { IoClose } from 'react-icons/io5';

type FileData = {
    name: string;
    content: string;
    booksDirPath: string;
};

export const UploadModal = () => {
    const context = useContext(PageContext);
    const [fileDataList, setFileDataList] = useState<FileData[]>([]);
    const [fileName, setFileName] = useState<string>('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (!user || user.books_path === '') {
            console.error('User or books path is missing.');
            return;
        }
        acceptedFiles.forEach((file) => {
            if (file.type !== 'application/pdf') {
                console.error('Please upload a PDF file.');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onerror = () => console.log('File reading failed');
            reader.onabort = () => console.log('File reading was aborted');

            reader.onload = () => {
                const base64Data = (reader.result as string).split(',')[1];
                setFileDataList((prevFiles) => [
                    ...prevFiles,
                    {
                        name: file.name,
                        content: base64Data,
                        booksDirPath: user.books_path
                    }
                ]);
            };
        });

    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': [] },
    });

    useEffect(() => {
        return () => setFileDataList([]);
    }, [context?.isUploadModalOpen]);

    if (!context) return null;
    const { isUploadModalOpen, toggleUploadModal, setFiles, files, user } = context;
    if (!isUploadModalOpen) return null;

    const handleSaveFile = async () => {
        if (fileDataList) {
            await window.electron.on('save-files', fileDataList).then((result) => {
                setFiles([...files, ...result]);
                toggleUploadModal()
            });
        } else {
            console.error("No files selected.");
        }
    };

    const handleRemoveFile = (index: number) => {
        setFileDataList((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.container}>
            <div className={styles.modal_container}>
                <p className={styles.title}>Add new file</p>
                {fileDataList.length <= 1 ? (
                    <input
                        type="text"
                        placeholder='File Name'
                        defaultValue={fileDataList[0]?.name.split('.').slice(0, -1).join('.')}
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                ) : (
                    <div className={styles.files_name_container}>
                        {fileDataList.map((file, index) => {
                            return (
                                <div key={index} className={styles.file_name_container}>
                                    <p className={styles.file_name}>{file.name}</p>
                                    <IoClose className={styles.remove_icon} onClick={() => handleRemoveFile(index)} />
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className={styles.upload_file_area_container} {...getRootProps()}>
                    <LiaCloudUploadAltSolid size={96} />
                    <input {...getInputProps()} />
                    <p>{isDragActive ? 'Drop the file here...' : 'Browse file to upload!'}</p>
                </div>

                <div className={styles.footer_container}>
                    <Button outline onClick={() => toggleUploadModal()}>Give up</Button>
                    <div className={styles.selected_file_details_container}>
                        {fileDataList.length === 1 ? fileDataList[0].name.slice(0, 28) + '...' :
                            fileDataList.length > 1 ? `${fileDataList.length}x files uploaded` : 'No files uploaded'}
                        <LuTrash size={16} className={styles.remove_file_icon} onClick={() => setFileDataList([])} />
                    </div>
                    <Button variant='primary' onClick={() => handleSaveFile()}>Ready</Button>
                </div>
            </div>
        </div>
    );
};
