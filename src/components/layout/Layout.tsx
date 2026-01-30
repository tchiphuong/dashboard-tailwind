import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex flex-1 flex-col space-y-2">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-colors duration-300 dark:bg-zinc-900">
                        <div className="container mx-auto gap-3 p-3">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
