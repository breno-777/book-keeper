import styles from './switch.module.scss'

export const Switch = () => {
    return (
        <label className={styles.switch}>
            <input type="checkbox" />
            <span className={styles.slider}></span>
        </label>
    );
};
