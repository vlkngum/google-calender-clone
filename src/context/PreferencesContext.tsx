import { createContext, useContext, useState } from "react";
import type { ReactNode} from 'react';

interface PreferencesContextType {
    language: string;
    isDarkMode: boolean;
    calendarType: number;

    setLanguage: (language: string) => void;
    setIsDarkMode: (isDark: boolean) => void;
    setCalendarType: (type: number) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<string>("tr");
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [calendarType, setCalendarType] = useState<number>(0);

    return (
        <PreferencesContext.Provider
            value={{
                language,
                isDarkMode,
                calendarType,
                setLanguage,
                setIsDarkMode,
                setCalendarType,
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