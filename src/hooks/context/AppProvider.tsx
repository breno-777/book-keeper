import { ReactNode } from "react";
import { PageProvider } from "./page/PageContext";

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <PageProvider>
            {children}
        </PageProvider>
    );
}