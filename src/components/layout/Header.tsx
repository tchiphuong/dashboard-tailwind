import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MoonIcon, SunIcon, BellIcon, ChevronDownIcon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
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
            .then(res => res.json())
            .then((data: Notification[]) => setNotifications(data))
            .catch(console.error);
    }, []);

    // Fetch user
    useEffect(() => {
        fetch('https://randomuser.me/api/')
            .then(res => res.json())
            .then(data => setUser(data.results[0]))
            .catch(console.error);
    }, []);

    const markAllAsRead = () => {
        setNotifications([]);
        setNotificationOpen(false);
    };

    return (
        <header className="h-16 z-50 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
            <div className="mx-auto px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger/X button */}
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none transition-colors relative w-8 h-8"
                        >
                            <span
                                className={`absolute rounded-full block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${sidebarOpen ? 'rotate-45 top-3.5' : 'top-2'
                                    }`}
                            />
                            <span
                                className={`absolute rounded-full block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-0' : 'top-4'
                                    }`}
                            />
                            <span
                                className={`absolute rounded-full block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${sidebarOpen ? '-rotate-45 top-3.5' : 'top-6'
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
                            className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none dark:text-white dark:hover:text-gray-200 transition-colors"
                        >
                            {darkMode ? (
                                <SunIcon className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <MoonIcon className="w-5 h-5 text-blue-500" />
                            )}
                        </button>

                        {/* Notification Bell */}
                        <div ref={notificationRef} className="relative">
                            <button
                                onClick={() => setNotificationOpen(!notificationOpen)}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none transition-colors"
                            >
                                <BellIcon className="w-5 h-5" />
                            </button>
                            {notifications.length > 0 && (
                                <span className="absolute right-0 top-0 inline-flex -translate-y-1/4 translate-x-1/4 transform items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-bold leading-none text-white">
                                    {notifications.length > 99 ? '99+' : notifications.length}
                                </span>
                            )}
                            {notificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-colors z-50">
                                    <div className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                                        {t('common.notifications')}
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {notifications.slice(0, 10).map(notification => (
                                            <a
                                                key={notification.id}
                                                href="#"
                                                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700"
                                            >
                                                <p className="line-clamp-1 font-medium" title={notification.name}>
                                                    {notification.name}
                                                </p>
                                                <p className="line-clamp-1 text-xs italic text-gray-500 mt-0.5">
                                                    {notification.email}
                                                </p>
                                                <p className="line-clamp-2 text-xs text-gray-500 mt-1">
                                                    {notification.body}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                                        {t('common.unreadNotifications', { count: notifications.length })}
                                    </div>
                                    <button
                                        onClick={markAllAsRead}
                                        className="block w-full px-4 py-2.5 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-b-xl"
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
                                className="flex items-center focus:outline-none lg:space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <img
                                    src={user?.picture?.medium || 'https://via.placeholder.com/150'}
                                    alt="User avatar"
                                    className="h-9 w-9 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                                />
                                <div className="hidden flex-col items-start lg:flex">
                                    <span className="line-clamp-1 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {user ? `${user.name.first} ${user.name.last}` : t('common.loading')}
                                    </span>
                                    <span className="line-clamp-1 text-left text-xs text-gray-500 dark:text-gray-400">
                                        {user?.email || t('common.loading')}
                                    </span>
                                </div>
                                <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-colors z-50">
                                    <div className="flex flex-col items-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 lg:hidden">
                                        <span className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {user ? `${user.name.first} ${user.name.last}` : t('common.loading')}
                                        </span>
                                        <span className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                                            {user?.email || t('common.loading')}
                                        </span>
                                    </div>
                                    <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                                        {t('common.profile')}
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                                        {t('common.settings')}
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-b-xl">
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
