import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ChevronDownIcon,
    LanguageIcon,
    HomeIcon,
    FolderOpenIcon,
    UsersIcon,
    CubeIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    Cog6ToothIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
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
};

// Menu data with translation keys
const menuData: MenuItem[] = [
    {
        title: "menu.dashboard",
        icon: "fa-tachometer-alt",
        children: [
            { title: "menu.overview", link: "/dashboard" },
            { title: "menu.analytics", link: "/dashboard/analytics" }
        ]
    },
    {
        title: "menu.projects",
        icon: "fa-folder-open",
        children: [
            { title: "menu.list", link: "/projects" },
            { title: "menu.createNew", link: "/projects/new" }
        ]
    },
    {
        title: "menu.users",
        icon: "fa-users",
        children: [
            { title: "menu.list", link: "/users" },
            { title: "menu.roles", link: "/users/roles" }
        ]
    },
    {
        title: "menu.products",
        icon: "fa-box",
        link: "/products"
    },
    {
        title: "menu.posts",
        icon: "fa-file-alt",
        link: "/posts"
    },
    {
        title: "menu.assets",
        icon: "fa-box",
        children: [
            { title: "menu.assetList", link: "/assets" },
            { title: "menu.requests", link: "/assets/requests" }
        ]
    },
    {
        title: "menu.finance",
        icon: "fa-dollar-sign",
        children: [
            { title: "menu.budget", link: "/finance/budgets" },
            { title: "menu.invoices", link: "/finance/invoices" }
        ]
    },
    {
        title: "common.settings",
        icon: "fa-cogs",
        link: "/settings"
    },
    {
        title: "menu.todos",
        icon: "fa-check-square",
        link: "/todos"
    },
    {
        title: "menu.comments",
        icon: "fa-comments",
        link: "/comments"
    },
    {
        title: "menu.quotes",
        icon: "fa-quote-left",
        link: "/quotes"
    }
];

interface MenuItemProps {
    item: MenuItem;
    onNavigate: (link: string) => void;
    currentPath: string;
}

function SidebarMenuItem({ item, onNavigate, currentPath }: MenuItemProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const IconComponent = item.icon ? iconComponents[item.icon] : null;

    const handleClick = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        } else if (item.link) {
            onNavigate(item.link);
        }
    };

    const isActive = item.link === currentPath ||
        (hasChildren && item.children?.some(child => child.link === currentPath));

    return (
        <li>
            <button
                onClick={handleClick}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg mx-2 ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''
                    }`}
                style={{ width: 'calc(100% - 1rem)' }}
            >
                <span className="flex items-center gap-3">
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <span className="text-sm font-medium">{t(item.title)}</span>
                </span>
                {hasChildren && (
                    <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
            </button>
            {hasChildren && isOpen && (
                <ul className="mt-1 ml-4 space-y-1">
                    {item.children?.map((child, index) => (
                        <li key={index}>
                            <button
                                onClick={() => child.link && onNavigate(child.link)}
                                className={`block w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-lg ${child.link === currentPath ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : ''
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

const languages = [
    { code: 'en', name: 'English', flag: usFlag },
    { code: 'vi', name: 'Tiếng Việt', flag: vnFlag },
    { code: 'ja', name: '日本語', flag: jpFlag },
    { code: 'zh', name: '中文', flag: cnFlag },
];

export function Sidebar() {
    const { i18n } = useTranslation();
    const { sidebarOpen, closeSidebar } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();
    const [langOpen, setLangOpen] = useState(false);

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    const handleNavigate = (link: string) => {
        navigate(link);
        if (window.innerWidth < 1024) {
            closeSidebar();
        }
    };

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setLangOpen(false);
    };

    return (
        <aside
            className={`transition-all duration-300 ease-in-out sidebar-transition fixed top-16 left-0 z-40 flex h-[calc(100vh-4rem)] flex-col bg-white dark:bg-gray-800 shadow-lg overflow-hidden lg:relative lg:top-0 ${sidebarOpen
                ? 'translate-x-0 opacity-100 w-full lg:w-64'
                : '-translate-x-full opacity-0 lg:w-0 lg:translate-x-0'
                }`}
        >
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {menuData.map((item, index) => (
                        <SidebarMenuItem
                            key={index}
                            item={item}
                            onNavigate={handleNavigate}
                            currentPath={location.pathname}
                        />
                    ))}
                </ul>
            </nav>

            {/* Language Selector */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="relative">
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <LanguageIcon className="w-5 h-5 text-gray-500" />
                            <div className="flex items-center gap-2">
                                <img
                                    src={currentLang.flag}
                                    alt={currentLang.name}
                                    className="w-6 h-6 rounded-full shadow-sm object-cover"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{currentLang.name}</span>
                            </div>
                        </span>
                        <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {langOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg bg-white dark:bg-gray-700 py-1 shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${lang.code === i18n.language ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <img
                                        src={lang.flag}
                                        alt={lang.name}
                                        className="w-6 h-6 rounded-full shadow-sm object-cover"
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
