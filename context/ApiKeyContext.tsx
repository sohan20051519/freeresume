
import React, { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';

interface ApiKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
    isApiKeyModalOpen: boolean;
    setIsApiKeyModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyState] = useState<string | null>(null);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('googleGenaiApiKey');
        if (storedKey) {
            setApiKeyState(storedKey);
        }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'googleGenaiApiKey') {
                setApiKeyState(event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const setApiKey = (key: string | null) => {
        setApiKeyState(key);
        if (key) {
            localStorage.setItem('googleGenaiApiKey', key);
        } else {
            localStorage.removeItem('googleGenaiApiKey');
        }
    };
    
    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};
