import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

interface NavbarContextType {
    navbarOpen: boolean;
    toggleNavbar: () => void;
    closeNavbar: () => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { readonly children: ReactNode }) {
    const [navbarOpen, setNavbarOpen] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("navbarOpen");
        if (saved !== null) {
            setNavbarOpen(saved === "true");
        } else if (typeof window !== "undefined" && window.innerWidth < 768) {
            setNavbarOpen(false);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("navbarOpen", String(navbarOpen));
    }, [navbarOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setNavbarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleNavbar = () => {
        setNavbarOpen((prev) => !prev);
    };

    const closeNavbar = () => {
        setNavbarOpen(false);
    };

    const contextValue = useMemo(
        () => ({ navbarOpen, toggleNavbar, closeNavbar }),
        [navbarOpen],
    );

    return (
        <NavbarContext.Provider value={contextValue}>
            {children}
        </NavbarContext.Provider>
    );
}

export function useNavbarContext() {
    const context = useContext(NavbarContext);
    if (context === undefined) {
        throw new Error(
            "useNavbarContext must be used within a NavbarProvider",
        );
    }
    return context;
}
