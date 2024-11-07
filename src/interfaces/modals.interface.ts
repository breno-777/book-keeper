export interface IDialogModal {
    title: string;
    message: string;
    details?: string;
    variant?: string;

    confirmButtonVariant?: string;
    dismissButtonVariant?: string;
    confirmButtonOutline?: boolean;
    dismissButtonOutline?: boolean;
    confirmButtonText?: string;
    dismissButtonText?: string;
    onDismiss?: () => void;
    onConfirm?: () => void;

}