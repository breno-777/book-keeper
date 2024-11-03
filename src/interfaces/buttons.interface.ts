import { ReactNode } from "react";

export interface IButton {
    children: ReactNode;
    variant?: string;
    outline?: boolean;
    onClick?: () => void;
}