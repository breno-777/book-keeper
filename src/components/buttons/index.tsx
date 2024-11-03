import { IButton } from '@/interfaces/buttons.interface';
import styles from './buttons.module.scss'

export const Button = ({ variant = 'default', outline = false, children, onClick }: IButton) => {
    const buttonClass = outline
        ? `${styles.button} ${styles[`button--outline-${variant}`]}`
        : `${styles.button} ${styles[`button--${variant}`]}`;

    return (
        <button className={buttonClass} onClick={onClick}>
            {children}
        </button>
    );
};