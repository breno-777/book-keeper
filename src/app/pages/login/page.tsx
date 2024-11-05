'use client'

import React, { useEffect, useState } from 'react';
import styles from './login.module.scss'
import { AddUserCard } from '@/components/users/add/card'
import { IUser } from '@/interfaces/user.interface';
import { AddUserModal } from '@/components/modals/users/add';

export function Login() {
    const [users, setUsers] = useState<IUser[]>([]);
    useEffect(() => {
        window.electron.getAllUsers('get-all-users').then((users: IUser[]) => {
            setUsers(users);
        })
    }, []);
    return (
        <div className={styles.container}>
            <p className={styles.title}><span>Book</span> Keeper</p>

            <div
                className={styles.user_container}
                style={
                    { '--user-quantity': users.length >= 2 ? users.length + 1 : users.length >= 1 ? 2 : 1 } as React.CSSProperties
                }>
                {users.length > 0 && (
                    users.map((user, index) => {
                        return (
                            <AddUserCard key={index} userData={user} />
                        )
                    })
                )}
                <AddUserCard userData={null} />
            </div>

            <AddUserModal />
        </div>
    )
}