import { PageContextType } from "@/types/pageContext.type";
import { useContext } from "react";
import { PageContext } from "./context/page/PageContext";

export const usePage = (): PageContextType => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error("usePage must be used within a PageProvider");
    }
    return context;
}
