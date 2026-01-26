import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ChevronDownIcon,
    HomeIcon,
    FolderOpenIcon,
    UsersIcon,
    CubeIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    ChatBubbleBottomCenterTextIcon,
    MagnifyingGlassIcon,
    StarIcon,
    XMarkIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useSidebar } from '@/contexts/SidebarContext';
import { MenuItem } from '@/types';

// Icon mapping
const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    'fa-tachometer-alt': HomeIcon,
    'fa-folder-open': FolderOpenIcon,
    'fa-users': UsersIcon,
    'fa-box': CubeIcon,
    'fa-file-alt': DocumentTextIcon,
    'fa-dollar-sign': CurrencyDollarIcon,
    'fa-cogs': Cog6ToothIcon,
    'fa-check-square': CheckCircleIcon,
    'fa-comments': ChatBubbleLeftRightIcon,
    'fa-quote-left': ChatBubbleBottomCenterTextIcon,
    'fa-clipboard-check': ClipboardDocumentCheckIcon,
};

// Menu data with translation keys
const menuData: MenuItem[] = [
    {
        id: 'dashboard',
        title: 'menu.dashboard',
        icon: 'fa-tachometer-alt',
        shortcut: '1',
        description: 'View analytics and system overview',
        children: [
            { title: 'menu.overview', link: '/dashboard' },
            { title: 'menu.analytics', link: '/dashboard/analytics' },
        ],
    },
    {
        id: 'projects',
        title: 'menu.projects',
        icon: 'fa-folder-open',
        shortcut: '2',
        description: 'Manage your projects',
        children: [
            { title: 'menu.list', link: '/projects' },
            { title: 'menu.createNew', link: '/projects/new' },
        ],
    },
    {
        id: 'users',
        title: 'menu.users',
        icon: 'fa-users',
        shortcut: '3',
        description: 'User management and roles',
        children: [
            { title: 'menu.list', link: '/users' },
            { title: 'menu.roles', link: '/users/roles' },
        ],
    },
    {
        id: 'products',
        title: 'menu.products',
        icon: 'fa-box',
        shortcut: '4',
        description: 'Product catalog management',
        link: '/products',
    },
    {
        id: 'posts',
        title: 'menu.posts',
        icon: 'fa-file-alt',
        shortcut: '5',
        description: 'Blog posts and articles',
        link: '/posts',
    },
    {
        id: 'assets',
        title: 'menu.assets',
        icon: 'fa-box',
        description: 'Asset management system',
        children: [
            { title: 'menu.assetList', link: '/assets' },
            { title: 'menu.requests', link: '/assets/requests' },
        ],
    },
    {
        id: 'finance',
        title: 'menu.finance',
        icon: 'fa-dollar-sign',
        description: 'Financial reports and invoices',
        children: [
            { title: 'menu.budget', link: '/finance/budgets' },
            { title: 'menu.invoices', link: '/finance/invoices' },
        ],
    },
    {
        id: 'approvals',
        title: 'menu.approvals',
        icon: 'fa-clipboard-check',
        shortcut: '6',
        description: 'Approval management',
        children: [
            { title: 'menu.submitRequest', link: '/approvals/submit' },
            { title: 'menu.approve', link: '/approvals/approve' },
            { title: 'menu.pending', link: '/approvals/pending' },
            { title: 'menu.history', link: '/approvals/history' },
        ],
    },
    {
        id: 'settings',
        title: 'common.settings',
        icon: 'fa-cogs',
        shortcut: '0',
        description: 'System configuration',
        link: '/settings',
    },
    {
        id: 'todos',
        title: 'menu.todos',
        icon: 'fa-check-square',
        description: 'Task management',
        link: '/todos',
    },
    {
        id: 'comments',
        title: 'menu.comments',
        icon: 'fa-comments',
        description: 'User comments and feedback',
        link: '/comments',
    },
    {
        id: 'quotes',
        title: 'menu.quotes',
        icon: 'fa-quote-left',
        description: 'Inspirational quotes',
        link: '/quotes',
    },
];

// Badge counts (mock data - in real app, fetch from API)
const badgeCounts: Record<string, number> = {
    todos: 5,
    comments: 12,
    projects: 3,
};

interface MenuItemProps {
    item: MenuItem;
    onNavigate: (link: string) => void;
    currentPath: string;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    badgeCount?: number;
}

function SidebarMenuItem({
    item,
    onNavigate,
    currentPath,
    isFavorite,
    onToggleFavorite,
    badgeCount,
}: MenuItemProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const IconComponent = item.icon ? iconComponents[item.icon] : null;

    const handleClick = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        } else if (item.link) {
            onNavigate(item.link);
        }
    };

    const isActive =
        item.link === currentPath ||
        (hasChildren && item.children?.some((child) => child.link === currentPath));

    return (
        <li className="relative">
            <div className="group relative flex items-center">
                <button
                    onClick={handleClick}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`mx-2 flex flex-1 cursor-pointer items-center justify-between rounded-full p-1.5 transition-all duration-200 ${
                        isActive
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`}
                    style={{ width: 'calc(100% - 1rem)' }}
                >
                    <span className="flex flex-1 items-center gap-3 overflow-hidden">
                        {IconComponent && (
                            <span
                                className={`shrink-0 rounded-full p-1.5 transition-colors ${
                                    isActive
                                        ? 'bg-white/20'
                                        : 'bg-gray-100 group-hover:bg-blue-100 dark:bg-gray-700 dark:group-hover:bg-blue-900/30'
                                }`}
                            >
                                <IconComponent
                                    className={`h-4 w-4 ${isActive ? '' : 'group-hover:text-blue-500'}`}
                                />
                            </span>
                        )}
                        <span className="flex-1 truncate text-left text-sm font-medium">
                            {t(item.title)}
                        </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-1">
                        {/* Badge */}
                        {badgeCount && badgeCount > 0 && (
                            <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                                {badgeCount > 99 ? '99+' : badgeCount}
                            </span>
                        )}

                        {/* Keyboard Shortcut */}
                        {item.shortcut && !hasChildren && (
                            <kbd
                                className={`hidden rounded-md border px-1.5 py-0.5 text-[10px] font-semibold sm:inline ${
                                    isActive
                                        ? 'border-white/30 bg-white/20 text-white'
                                        : 'border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-300'
                                }`}
                            >
                                ⌘ + {item.shortcut}
                            </kbd>
                        )}

                        {/* Favorite Star - inside button */}
                        {item.id && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(item.id!);
                                }}
                                className="rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/20"
                            >
                                {isFavorite ? (
                                    <StarIconSolid className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <StarIcon
                                        className={`h-4 w-4 ${isActive ? 'text-white/70 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-500'}`}
                                    />
                                )}
                            </span>
                        )}

                        {hasChildren && (
                            <ChevronDownIcon
                                className={`mx-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        )}
                    </span>
                </button>

                {/* Tooltip */}
                {showTooltip && item.description && (
                    <div className="pointer-events-none absolute left-full z-50 ml-2 w-48 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                        {item.description}
                        <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-gray-700"></div>
                    </div>
                )}
            </div>

            {hasChildren && isOpen && (
                <ul className="mt-2 ml-6 cursor-pointer space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700">
                    {item.children?.map((child, index) => (
                        <li className="px-2" key={index}>
                            <button
                                onClick={() => child.link && onNavigate(child.link)}
                                className={`relative block w-full cursor-pointer rounded-full py-2 pr-3 pl-4 text-left text-sm transition-all duration-200 ${
                                    child.link === currentPath
                                        ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-200'
                                }`}
                            >
                                {t(child.title)}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}

import usFlag from '@/assets/flags/us.png';
import vnFlag from '@/assets/flags/vn.png';
import jpFlag from '@/assets/flags/jp.png';
import cnFlag from '@/assets/flags/cn.png';
import koFlag from '@/assets/flags/ko.png';
import thFlag from '@/assets/flags/th.png';

const languages = [
    { code: 'en', name: 'English', flag: usFlag },
    { code: 'vi', name: 'Tiếng Việt', flag: vnFlag },
    { code: 'ja', name: '日本語', flag: jpFlag },
    { code: 'zh', name: '中文', flag: cnFlag },
    { code: 'ko', name: '한국어', flag: koFlag },
    { code: 'th', name: 'ไทย', flag: thFlag },
];

const FAVORITES_KEY = 'sidebar-favorites';

export function Sidebar() {
    const { t, i18n } = useTranslation();
    const { sidebarOpen, closeSidebar } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();
    const [langOpen, setLangOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load favorites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(FAVORITES_KEY);
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    // Save favorites to localStorage
    const toggleFavorite = (id: string) => {
        setFavorites((prev) => {
            const newFavorites = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

    const handleNavigate = useCallback(
        (link: string) => {
            navigate(link);
            if (window.innerWidth < 1024) {
                closeSidebar();
            }
        },
        [navigate, closeSidebar]
    );

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setLangOpen(false);
    };

    // Filter menu items based on search
    const filteredMenu = menuData.filter((item) => {
        if (!searchQuery) return true;
        const title = t(item.title).toLowerCase();
        const query = searchQuery.toLowerCase();
        return (
            title.includes(query) ||
            item.children?.some((child) => t(child.title).toLowerCase().includes(query))
        );
    });

    // Separate favorites and regular items
    const favoriteItems = filteredMenu.filter((item) => item.id && favorites.includes(item.id));
    const regularItems = filteredMenu.filter((item) => !item.id || !favorites.includes(item.id));

    // Keyboard shortcuts handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for Ctrl/Cmd + number
            if ((e.ctrlKey || e.metaKey) && /^[0-9]$/.test(e.key)) {
                e.preventDefault();
                const item = menuData.find((m) => m.shortcut === e.key);
                if (item) {
                    if (item.link) {
                        handleNavigate(item.link);
                    } else if (item.children?.[0]?.link) {
                        handleNavigate(item.children[0].link);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNavigate]);

    return (
        <aside
            className={`sidebar-transition fixed top-16 left-0 z-40 flex h-[calc(100vh-4rem)] flex-col overflow-hidden bg-white shadow-lg transition-all duration-300 ease-in-out lg:relative lg:top-0 lg:m-3 lg:h-[calc(100vh-5.5rem)] lg:rounded-xl lg:border lg:border-gray-200 dark:bg-gray-800 dark:lg:border-gray-600 ${
                sidebarOpen
                    ? 'w-full translate-x-0 opacity-100 lg:w-64'
                    : '-translate-x-full opacity-0 lg:w-0 lg:translate-x-0'
            }`}
        >
            {/* Search Box */}
            <div className="border-b border-gray-200 p-3 dark:border-gray-700">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('common.search') + '...'}
                        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pr-8 pl-9 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            <XMarkIcon className="h-4 w-4 text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 overflow-x-hidden overflow-y-auto py-4">
                {/* Favorites Section */}
                {favoriteItems.length > 0 && (
                    <div className="mb-4">
                        <div className="mb-2 flex items-center gap-2 px-4">
                            <StarIconSolid className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                {t('common.favorites') || 'Favorites'}
                            </span>
                        </div>
                        <ul className="space-y-1">
                            {favoriteItems.map((item, index) => (
                                <SidebarMenuItem
                                    key={`fav-${index}`}
                                    item={item}
                                    onNavigate={handleNavigate}
                                    currentPath={location.pathname}
                                    isFavorite={true}
                                    onToggleFavorite={toggleFavorite}
                                    badgeCount={item.id ? badgeCounts[item.id] : undefined}
                                />
                            ))}
                        </ul>
                        <div className="mx-4 my-3 border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                )}

                {/* Regular Menu Items */}
                <ul className="space-y-1">
                    {regularItems.map((item, index) => (
                        <SidebarMenuItem
                            key={index}
                            item={item}
                            onNavigate={handleNavigate}
                            currentPath={location.pathname}
                            isFavorite={item.id ? favorites.includes(item.id) : false}
                            onToggleFavorite={toggleFavorite}
                            badgeCount={item.id ? badgeCounts[item.id] : undefined}
                        />
                    ))}
                </ul>

                {/* No Results */}
                {filteredMenu.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('common.noResults') || 'No results found'}
                    </div>
                )}
            </nav>

            {/* Language Selector */}
            <div className="border-t border-gray-200 p-3 dark:border-gray-700">
                <div className="relative">
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    >
                        <span className="flex items-center gap-2">
                            {/* <LanguageIcon className="h-5 w-5 text-gray-500" /> */}
                            <div className="flex items-center gap-2">
                                <img
                                    src={currentLang.flag}
                                    alt={currentLang.name}
                                    className="h-6 w-6 rounded-full object-cover shadow-sm"
                                />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {currentLang.name}
                                </span>
                            </div>
                        </span>
                        <ChevronDownIcon
                            className={`h-4 w-4 text-gray-500 transition-transform ${langOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {langOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50">
                            {languages
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .filter((lang) => lang.code !== i18n.language)
                                .map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`flex w-full items-center gap-3 px-2.5 py-2.5 text-sm transition-all duration-200 ${
                                            lang.code === i18n.language
                                                ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                                        }`}
                                    >
                                        <img
                                            src={lang.flag}
                                            alt={lang.name}
                                            className="h-6 w-6 rounded-full object-cover shadow-sm"
                                        />
                                        <span>{lang.name}</span>
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
