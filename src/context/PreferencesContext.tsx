import { createContext, useContext, useState } from "react";
import type { ReactNode} from 'react';

interface PreferencesContextType {
    language: string;
    isDarkMode: boolean;
    calendarType: number;
    isSidebarOpen: boolean

    setLanguage: (language: string) => void;
    setIsDarkMode: (isDark: boolean) => void;
    setCalendarType: (type: number) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<string>("tr");
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [calendarType, setCalendarType] = useState<number>(4);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <PreferencesContext.Provider
            value={{
                language,
                isDarkMode,
                calendarType,
                isSidebarOpen,
                setLanguage,
                setIsDarkMode,
                setCalendarType,
                setIsSidebarOpen
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error();
    }
    return context;
};