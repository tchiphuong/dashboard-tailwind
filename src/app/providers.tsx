"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";

import { NavbarProvider, AuthProvider, SidebarProvider } from "@/contexts";
import { Toast } from "@/components/common";

/**
 * Root Providers cho Dashboard
 * Tham khảo cấu trúc UniManage
 */
export function Providers({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AuthProvider>
                    <NavbarProvider>
                        <SidebarProvider>
                            <Toast.Provider placement="top end" />
                            {children}
                        </SidebarProvider>
                    </NavbarProvider>
                </AuthProvider>
            </NextThemesProvider>
        </QueryClientProvider>
    );
}
