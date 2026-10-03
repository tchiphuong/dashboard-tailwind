'use client';

import React from 'react';
import { Header } from '@/app/(admin)/components/header';
import { Navbar } from '@/app/(admin)/components/navbar';

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="bg-background text-foreground flex h-screen flex-col overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Navbar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <main className="bg-background text-foreground flex-1 overflow-x-hidden overflow-y-auto p-4">
                        <div className="container mx-auto">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Layout;
