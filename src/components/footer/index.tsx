import { useEffect, useState } from 'react'
import styles from './footer.module.scss'
export const Footer = () => {
    const [version, setVersion] = useState('');
    useEffect(() => {
        async function getApplicationVersio() {
            await window.electron.on('get-current-version').then((version: string) => {
                setVersion(version);
            })
        }
        getApplicationVersio();
    }, []);
    return (
        <div className={styles.container}>
            <footer>
                <p>By: Breno Amarante</p>
                <p>Book Keeper {version ? version : 'v0.0.0'}</p>
            </footer>
        </div>

    )
}