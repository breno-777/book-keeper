import { Button } from '@/components/buttons';
import styles from './add.module.scss';
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '@/interfaces/user.interface';
import { PageContext } from '@/hooks/context/page/PageContext';
import Image from 'next/image';
import { IoAdd, IoCameraOutline, IoDownloadOutline } from 'react-icons/io5';

export const AddUserModal = () => {
    const context = useContext(PageContext);
    const [name, setName] = useState<string>('');
    const [userContent, setUserContent] = useState();

    useEffect(() => {
        setName('');
        if (context && userContent) {
            setUser(userContent)
        }
    }, [context, userContent])

    if (!context) return null;
    const { isAddUserModalOpen, toggleAddUserModal, setUser } = context;
    if (!isAddUserModalOpen) return null;

    const id = uuidv4();
    const userData: IUser = {
        id: id,
        name: name,
        books_path: ''
    }

    const handleCreateUser = async () => {
        if (name) {
            await window.electron.createUser('create-user', userData).then((response) => {
                setUserContent(response);
            });
            if (userContent) {
                setUser(userContent);
                toggleAddUserModal();
            }
        }
    }

    return (
        <div className={styles.contianer}>
            <div className={styles.modal_container}>
                <div className={styles.left_side} />
                <div className={styles.right_side} >
                    <p className={styles.title}>New User</p>
                    <div className={styles.user_avatar_container}>
                        {userData ? (
                            userData.avatar ? (
                                <Image src='' alt="user_avatar" priority width={94} height={94} />
                            ) : (
                                <IoCameraOutline size={32} />
                            )
                        ) : (
                            <IoAdd size={46} className={styles.icon} />
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder='Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className={styles.buttons_container}>
                        <Button variant='danger' outline onClick={() => toggleAddUserModal()}>Cancel</Button>
                        <Button variant='primary' onClick={() => handleCreateUser()}>Create</Button>
                    </div>

                    <div className={styles.divider_container}>
                        <div className={styles.divider} />
                        <p>Or</p>
                        <div className={styles.divider} />
                    </div>

                    <div className={styles.import_container}>
                        <p>Import existing user</p>
                        <IoDownloadOutline size={22} />
                    </div>
                </div>

            </div>
        </div >
    )
}