import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MoonIcon,
    SunIcon,
    BellIcon,
    ChevronDownIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useClickOutside } from '@/hooks';
import { Notification, User } from '@/types';

export function Header() {
    const { t } = useTranslation();
    const { darkMode, toggleDarkMode } = useTheme();
    const { sidebarOpen, toggleSidebar } = useSidebar();

    // Notifications state
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    useClickOutside(notificationRef, () => setNotificationOpen(false));

    // User state
    const [user, setUser] = useState<User | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    useClickOutside(userMenuRef, () => setUserMenuOpen(false));

    // Fetch notifications
    useEffect(() => {
        const randomLimit = Math.floor(Math.random() * 50) + 1;
        fetch(`https://jsonplaceholder.typicode.com/comments?_limit=${randomLimit}`)
            .then((res) => res.json())
            .then((data: Notification[]) => setNotifications(data))
            .catch(console.error);
    }, []);

    // Fetch user
    useEffect(() => {
        fetch('https://randomuser.me/api/')
            .then((res) => res.json())
            .then((data) => setUser(data.results[0]))
            .catch(console.error);
    }, []);

    const markAllAsRead = () => {
        setNotifications([]);
        setNotificationOpen(false);
    };

    return (
        <header className="z-50 h-16 bg-white shadow-md transition-colors duration-300 dark:bg-zinc-800">
            <div className="mx-auto h-full px-4">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger/X button */}
                        <button
                            onClick={toggleSidebar}
                            className="relative h-8 w-8 text-gray-600 transition-colors hover:text-gray-800 focus:outline-none dark:text-gray-300 dark:hover:text-gray-100"
                        >
                            <span
                                className={`absolute block h-0.5 w-6 transform rounded-full bg-current transition duration-300 ease-in-out ${
                                    sidebarOpen ? 'top-3.5 rotate-45' : 'top-2'
                                }`}
                            />
                            <span
                                className={`absolute block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                                    sidebarOpen ? 'opacity-0' : 'top-4'
                                }`}
                            />
                            <span
                                className={`absolute block h-0.5 w-6 transform rounded-full bg-current transition duration-300 ease-in-out ${
                                    sidebarOpen ? 'top-3.5 -rotate-45' : 'top-6'
                                }`}
                            />
                        </button>

                        <img
                            src="https://images.freeimages.com/vhq/images/previews/214/generic-logo-140952.png"
                            alt="Company Logo"
                            className="h-8 max-w-20 object-contain"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 focus:outline-none dark:text-white dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                        >
                            {darkMode ? (
                                <SunIcon className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <MoonIcon className="h-5 w-5 text-blue-500" />
                            )}
                        </button>

                        {/* Notification Bell */}
                        <div ref={notificationRef} className="relative">
                            <button
                                onClick={() => setNotificationOpen(!notificationOpen)}
                                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 focus:outline-none dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                            >
                                <BellIcon className="h-5 w-5" />
                            </button>
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex translate-x-1/4 -translate-y-1/4 transform items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-xs leading-none font-bold text-white">
                                    {notifications.length > 99 ? '99+' : notifications.length}
                                </span>
                            )}
                            {notificationOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl border border-zinc-100 bg-white shadow-xl shadow-gray-200/50 transition-all duration-200 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-zinc-900/50">
                                    <div className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-zinc-700 dark:text-zinc-200">
                                        {t('common.notifications')}
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {notifications.slice(0, 10).map((notification) => (
                                            <a
                                                key={notification.id}
                                                href="#"
                                                className="block border-b border-zinc-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-gray-700"
                                            >
                                                <p
                                                    className="line-clamp-1 font-medium"
                                                    title={notification.name}
                                                >
                                                    {notification.name}
                                                </p>
                                                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 italic">
                                                    {notification.email}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                                    {notification.body}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                    <div className="border-t border-zinc-100 px-4 py-2 text-center text-sm text-gray-500 dark:border-zinc-700 dark:text-gray-400">
                                        {t('common.unreadNotifications', {
                                            count: notifications.length,
                                        })}
                                    </div>
                                    <button
                                        onClick={markAllAsRead}
                                        className="block w-full rounded-b-xl px-4 py-2.5 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {t('common.markAllAsRead')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div ref={userMenuRef} className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center rounded-lg p-1 transition-colors hover:bg-gray-100 focus:outline-none lg:space-x-2 dark:hover:bg-gray-700"
                            >
                                <img
                                    src={user?.picture?.medium || 'https://via.placeholder.com/150'}
                                    alt="User avatar"
                                    className="h-9 w-9 rounded-full border-2 border-zinc-200 object-cover dark:border-zinc-600"
                                />
                                <div className="hidden flex-col items-start lg:flex">
                                    <span className="line-clamp-1 text-left text-sm font-medium text-gray-900 dark:text-zinc-100">
                                        {user
                                            ? `${user.name.first} ${user.name.last}`
                                            : t('common.loading')}
                                    </span>
                                    <span className="line-clamp-1 text-left text-xs text-gray-500 dark:text-zinc-400">
                                        {user?.email || t('common.loading')}
                                    </span>
                                </div>
                                <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-zinc-100 bg-white py-1 shadow-xl shadow-gray-200/50 transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-zinc-900/50">
                                    <div className="flex flex-col items-start border-b border-zinc-100 px-4 py-2 text-sm text-gray-700 lg:hidden dark:border-zinc-700 dark:text-zinc-300">
                                        <span className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-zinc-100">
                                            {user
                                                ? `${user.name.first} ${user.name.last}`
                                                : t('common.loading')}
                                        </span>
                                        <span className="line-clamp-1 text-xs text-gray-500 dark:text-zinc-400">
                                            {user?.email || t('common.loading')}
                                        </span>
                                    </div>
                                    <a
                                        href="#"
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                    >
                                        <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                                        {t('common.profile')}
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                    >
                                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                                        {t('common.settings')}
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center rounded-b-xl px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                    >
                                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                        {t('common.signOut')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
