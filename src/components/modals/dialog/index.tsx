import { useContext } from 'react';
import styles from './dialog.module.scss'
import { PageContext } from '@/hooks/context/page/PageContext';
import { Button } from '@/components/buttons';
import { TiWarning } from 'react-icons/ti';

export const DialogModal = () => {
    const context = useContext(PageContext);
    if (!context) return null;

    const { isDialogModalOpen, dialogModalContents } = context;
    if (!isDialogModalOpen || !dialogModalContents) return null;

    return (
        <div className={styles.container}>
            <div className={styles.modal_container}>
                <div className={styles.header}>
                    <div className={styles.icon_container}>
                        <TiWarning className={styles.icon} size={32} />
                    </div>
                    <p className={styles.title}>{dialogModalContents.title}</p>
                </div>

                <div className={styles.body}>
                    <p className={styles.message}>{dialogModalContents.message}</p>
                    <p className={styles.details}>{dialogModalContents.details}</p>
                </div>

                <div className={styles.footer}>
                    <Button
                        onClick={dialogModalContents.onDismiss}
                        variant={dialogModalContents.confirmButtonVariant}
                        outline={dialogModalContents.confirmButtonOutline}>
                        {dialogModalContents.dismissButtonText ? dialogModalContents.dismissButtonText : 'Cancel'}
                    </Button>
                    <Button
                        onClick={dialogModalContents.onConfirm}
                        variant={dialogModalContents.dismissButtonVariant}
                        outline={dialogModalContents.dismissButtonOutline}>
                        {dialogModalContents.confirmButtonText ? dialogModalContents.confirmButtonText : 'Ok'}
                    </Button>
                </div>
            </div>
        </div>
    );
}