'use client'

import { FiEdit } from 'react-icons/fi'
import styles from './settings.module.scss'
import { useContext, useState } from 'react';
import { Colors } from '@/types/settings.type';
import { Button } from '@/components/buttons';
import { Switch } from '@/components/inputs/switch';
import { ColorPicker } from '@/components/inputs/color';
import Image from 'next/image';

import SystemTheme from '../../../assets/images/default_system_theme_card.png'
import LightTheme from '../../../assets/images/light_theme_card.png'
import DarkTheme from '../../../assets/images/dark_theme_card.png'
import { PageContext } from '@/hooks/context/page/PageContext';
import { RxExit } from 'react-icons/rx';
export default function Settings() {
    const [colors, setColors] = useState<Colors>({
        dark: {
            primary: '5932EA',
            secondary: '9197B3',
        },
        light: {
            primary: '5932EA',
            secondary: '9197B3',
        },
    });

    const handleColorChange = (
        type: 'dark' | 'light',
        colorType: 'primary' | 'secondary',
        newColor: string
    ) => {
        setColors((prevColors) => ({
            ...prevColors,
            [type]: {
                ...prevColors[type],
                [colorType]: newColor,
            },
        }));
    };

    const handleLogout = () => {
        clear();
    }
    const handleDeleteUser = async () => {
        await window.electron.on('delete-user', context?.user?.id);
        clear();
    }

    const context = useContext(PageContext);
    if (!context) return null;

    const { setCurrentPage, clear } = context;
    const handleClick = (page: string) => {
        setCurrentPage(page)
    };


    return (
        <div className={styles.container}>

            {/* 
            ————————————————————————————————————————————————————————————
            Theme Settings 
            ————————————————————————————————————————————————————————————
            */}
            <p>Select Theme</p>

            <div className={styles.theme_settings_container}>
                <div className={styles.theme_card_container}>
                    <Image className={styles.card} src={SystemTheme} alt='default_system_theme' width={408} height={294} />
                    <p>Default System</p>
                </div>
                <div className={styles.theme_card_container}>
                    <Image className={styles.card} src={LightTheme} alt='light_theme' width={408} height={294} />
                    <p>Light</p>
                </div>
                <div className={styles.theme_card_container}>
                    <Image className={styles.card} src={DarkTheme} alt='dark_theme' width={408} height={294} />
                    <p>Dark</p>
                </div>
            </div>



            <div className={styles.divider} />

            {/* 
            ————————————————————————————————————————————————————————————
            Colors Settings 
            ————————————————————————————————————————————————————————————
            */}
            <div className={styles.color_settings_container}>
                <div className={styles.details_container}>
                    <p className={styles.title}>Change the base color</p>
                    <p className={styles.subtitle}>Customize the base color of each theme</p>
                </div>
                <div className={styles.options_container}>

                    <p>Primary Color (Light Theme)</p>
                    <div className={styles.color_option}>
                        <ColorPicker
                            value={colors.light.primary}
                            onChange={(e) => handleColorChange('light', 'primary', e.target.value.slice(1))}
                        />
                        <div className={styles.color_code_container}>
                            <p>{colors.light.primary}</p>
                        </div>
                    </div>

                    <p>Secondary Color (Light Theme)</p>
                    <div className={styles.color_option}>
                        <ColorPicker
                            value={colors.light.secondary}
                            onChange={(e) => handleColorChange('light', 'secondary', e.target.value.slice(1))}
                        />
                        <div className={styles.color_code_container}>
                            <p>{colors.light.secondary}</p>
                        </div>
                    </div>

                </div>
                <div className={styles.options_container}>

                    <p>Primary Color (Dark Theme)</p>
                    <div className={styles.color_option}>
                        <ColorPicker
                            value={colors.dark.primary}
                            onChange={(e) => handleColorChange('dark', 'primary', e.target.value.slice(1))}
                        />
                        <div className={styles.color_code_container}>
                            <p>{colors.dark.primary}</p>
                        </div>
                    </div>

                    <p>Secondary Color (Dark Theme)</p>
                    <div className={styles.color_option}>
                        <ColorPicker
                            value={colors.dark.secondary}
                            onChange={(e) => handleColorChange('dark', 'secondary', e.target.value.slice(1))}
                        />
                        <div className={styles.color_code_container}>
                            <p>{colors.dark.secondary}</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.divider} />

            {/* 
            ————————————————————————————————————————————————————————————
            General Settings 
            ————————————————————————————————————————————————————————————
            */}
            <div className={styles.general_settings_container}>
                <div className={styles.options_container}>
                    <div className={styles.toggle_option_container}>
                        <div className={styles.toggle_option}>
                            <p>Show recently accessed</p>
                            <Switch />
                        </div>
                    </div>
                    <div className={styles.toggle_option_container}>
                        <div className={styles.toggle_option}>
                            <p>Automatically generate backups</p>
                            <Switch />
                        </div>
                        <div className={styles.toggle_sub_option}>
                            <p>Backup path</p>
                            <div className={styles.edit_sub_option}>
                                <p>C:/breno/documents/BookKeeper/backups/</p>
                                <FiEdit size={20} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.toggle_option_container}>
                        <div className={styles.toggle_option}>
                            <p>Automatically update version</p>
                            <Switch />
                        </div>
                        <div>
                            <Button variant='primary' onClick={() => console.log('Updating')}>Update</Button>
                        </div>
                        <div className={styles.exit_container}>
                            <RxExit />
                            <p onClick={() => handleLogout()}>Logout</p>
                        </div>
                        <div className={styles.exit_container}>
                            <RxExit />
                            <p onClick={() => handleDeleteUser()}>Delete User</p>
                        </div>
                    </div>
                </div>
                <div className={styles.options_container}>
                    <div className={styles.toggle_option_container}>
                        <div className={styles.toggle_option}>
                            <p>Empty trash automatically</p>
                            <Switch />
                        </div>
                        <div className={styles.toggle_sub_option}>
                            <p>The garbage can will be cleaned every</p>
                            <div className={styles.edit_sub_option}>
                                <p>60 Days</p>
                                <FiEdit size={20} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className={styles.footer}>
                <Button variant='default' outline={true} onClick={() => handleClick('all-books')}>Cancel</Button>
                <Button variant='primary' onClick={() => console.log('Save Change')}>Save Changes</Button>
            </div>
        </div>
    )
}