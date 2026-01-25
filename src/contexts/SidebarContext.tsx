import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            return localStorage.getItem('sidebarOpen') === 'true';
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem('sidebarOpen', String(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
