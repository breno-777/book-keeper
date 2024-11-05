import { Button } from '@/components/buttons';
import styles from './add.module.scss';
import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '@/interfaces/user.interface';
import { PageContext } from '@/hooks/context/page/PageContext';

export const AddUserModal = () => {
    const context = useContext(PageContext);
    const [username, setUsername] = useState<string>('');
    const [userContent, setUserContent] = useState();

    useEffect(() => {
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
        name: username,
        books_path: ''
    }

    const handleCreateUser = async () => {
        await window.electron.createUser('create-user', userData).then((response) => {
            setUserContent(response);
        });
        if (userContent) {
            setUser(userContent);
            toggleAddUserModal();
        }
    }

    return (
        <div className={styles.contianer}>
            <div className={styles.modal_container}>
                <h2>Add User</h2>
                <input type="text" placeholder='Username' value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <Button variant='primary' onClick={() => handleCreateUser()}>Create</Button>
                <p className={styles.cancel_button} onClick={() => toggleAddUserModal()}>Cancel</p>
            </div>
        </div >
    )
}