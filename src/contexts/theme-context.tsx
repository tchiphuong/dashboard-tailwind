"use client";

import { useTheme as useNextTheme } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export function useTheme() {
    const { theme, setTheme } = useNextTheme();
    return {
        darkMode: theme === "dark",
        toggleDarkMode: () => setTheme(theme === "dark" ? "light" : "dark"),
    };
}
