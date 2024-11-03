import styles from './colorPicker.module.scss'

interface ColorPickerProperties {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProperties) => {
    return (
        <div className={styles.color_picker}>
            <input
                type="color"
                value={`#${value}`}
                onChange={onChange}
            />
            <span className={styles.color_sphere} style={{ backgroundColor: `#${value}` }}></span>
        </div>
    );
};