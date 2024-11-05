import { useContext, useEffect, useRef, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import styles from './header.module.scss';
import { PageContext } from '@/hooks/context/page/PageContext';

export const Header = () => {
    const context = useContext(PageContext);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = () => setIsSearchFocused(true);
    const handleBlur = () => setIsSearchFocused(false);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (!context) return null;
    const { setSearchFilter, user} = context;

    return (
        <div className={styles.container}>
            <p className={`${styles.title} ${isSearchFocused && styles.hidden}`}>Welcome Back, {user?.name}!</p>
            <div className={styles.searchbar_container}>
                <div className={`${styles.shortcut_container} ${isSearchFocused && styles.hidden}`}>
                    CTRL + P
                </div>
                <div className={`${styles.searchbar} ${isSearchFocused && styles.expanded}`}>
                    <IoSearchOutline size={18} />
                    <input type="text"
                        placeholder='Search'
                        onFocus={() => handleFocus()}
                        onBlur={() => handleBlur()}
                        ref={inputRef}
                        value={context.searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}