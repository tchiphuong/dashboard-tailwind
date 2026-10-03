'use client';

import { ChevronDownIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Dropdown, Kbd, SearchField, Skeleton } from '@heroui/react';
import Cookies from 'js-cookie';
import { useLocale, useTranslations } from 'next-intl';
import React, { useCallback, useDeferredValue, useEffect, useRef, useState, useMemo } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { useNavbarContext } from '@/contexts/navbar-context';
import { useRouter } from '@/i18n/navigation';
import { useNavbar } from '@/services/navbar.service';
import { NavbarItem } from '@/types';
import { MenuIcon } from '@/components/common';

// Menu data with translation keys - organized by groups
// Menu data is now fetched from API via useMenu hook

// Badge counts (mock data - in real app, fetch from API)
const badgeCounts: Record<string, number> = {
    todos: 5,
    comments: 12,
    projects: 3,
};

interface NavbarItemProps {
    item: NavbarItem;
    onNavigate: (link: string) => void;
    currentPath: string;
    allMenuLinks: Set<string>;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    badgeCount?: number;
    isMac?: boolean;
}

const FavoriteButton = React.memo(
    ({
        id,
        isFavorite,
        isActive,
        onToggleFavorite,
    }: {
        id: string;
        isFavorite: boolean;
        isActive: boolean;
        onToggleFavorite: (id: string) => void;
    }) => (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(id);
            }}
            className="hover:bg-default/20 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:outline-none"
        >
            {isFavorite ? (
                <StarIconSolid className="text-warning h-4 w-4" />
            ) : (
                <StarIcon
                    className={`h-4 w-4 ${isActive ? 'text-accent-foreground/80 hover:text-warning' : 'text-muted hover:text-warning'}`}
                />
            )}
        </button>
    )
);

const NavbarItemComponent = React.memo(function NavbarItemComponent({
    item,
    currentPath,
    allMenuLinks,
    isFavorite,
    onToggleFavorite,
    onNavigate,
    badgeCount,
    isMac,
}: NavbarItemProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    const isLinkActive = useCallback(
        (link?: string) => {
            if (!link || link === '#') return false;
            // 1. Khớp chính xác hoàn toàn (Exact Match)
            if (link === currentPath) return true;

            // 2. Nếu đường dẫn hiện tại đã khớp chính xác với một menu item khác trong cây menu,
            // thì mục này KHÔNG ĐƯỢC active theo tiền tố nữa để tránh lỗi 2 menu cùng sáng trong 1 nhóm
            if (allMenuLinks.has(currentPath)) {
                return false;
            }

            // 3. Fallback cho các trang con chi tiết nội bộ (không xuất hiện trên sidebar, ví dụ: /products/123)
            if (link !== '/' && currentPath.startsWith(`${link}/`)) {
                return true;
            }
            return false;
        },
        [currentPath, allMenuLinks]
    );

    const isDirectActive = isLinkActive(item.link);
    const hasActiveChild = Boolean(
        hasChildren && item.children?.some((child) => isLinkActive(child.link))
    );
    const isActive = isDirectActive || hasActiveChild;

    useEffect(() => {
        if (isActive && hasChildren) {
            setIsOpen(true);
        }
    }, [hasChildren, isActive]);

    const handleExpandToggle = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    // Phân cấp trực quan theo nguyên tắc Pastel:
    // - Menu đơn đang chọn: bg-accent text-accent-foreground
    // - Menu cha có mục con đang chọn: bg-accent/15 text-accent dịu nhẹ
    // - Mặc định: hover nhẹ nhàng
    let itemClasses = 'text-foreground/80 hover:bg-default/40 hover:text-foreground';
    if (!hasChildren && isDirectActive) {
        itemClasses = 'bg-accent text-accent-foreground shadow-md shadow-accent/25';
    } else if (hasChildren && hasActiveChild) {
        itemClasses = 'bg-accent/15 text-accent font-medium shadow-sm';
    }

    const commonClasses = `mx-2 flex flex-1 cursor-pointer items-center justify-between rounded-full p-1.5 transition-all duration-200 ${itemClasses}`;

    const isSolidActive = !hasChildren && isDirectActive;
    const isParentSoftActive = hasChildren && hasActiveChild;
    const isHighlighted = isSolidActive || isParentSoftActive;

    const content = (
        <>
            <span className="flex flex-1 items-center gap-3 overflow-hidden">
                <span
                    className={`flex shrink-0 items-center justify-center rounded-full transition-colors ${
                        isSolidActive
                            ? 'bg-accent-foreground/20 p-1.5'
                            : isParentSoftActive
                              ? 'bg-accent/20 p-1.5'
                              : 'group-hover:bg-accent/10 bg-transparent p-1.5'
                    }`}
                >
                    <MenuIcon
                        icon={item.icon}
                        id={item.id}
                        title={item.title}
                        className={`h-5 w-5 transition-all duration-200 ${
                            isSolidActive
                                ? 'text-accent-foreground drop-shadow-md'
                                : isParentSoftActive
                                  ? 'text-accent drop-shadow-sm'
                                  : 'text-muted group-hover:text-accent'
                        }`}
                    />
                </span>
                <span
                    className={`flex-1 truncate text-left text-sm ${
                        isHighlighted ? 'font-medium' : 'font-normal'
                    }`}
                >
                    {t(item.title)}
                </span>
            </span>

            <span className="flex shrink-0 items-center gap-1">
                {/* Badge */}
                {badgeCount !== undefined && badgeCount > 0 && (
                    <span className="bg-danger text-danger-foreground rounded-full px-1.5 py-0.5 text-xs font-bold">
                        {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                )}

                {/* Keyboard Shortcut - Auto detect Windows (Ctrl) & macOS (Cmd) */}
                {item.shortcut && !hasChildren && (
                    <Kbd
                        suppressHydrationWarning
                        variant="light"
                        className={`hidden text-[10px] sm:inline-flex ${
                            isSolidActive ? 'text-white' : ''
                        }`}
                    >
                        <Kbd.Abbr keyValue={isMac ? 'command' : 'ctrl'} />
                        <Kbd.Content>{item.shortcut}</Kbd.Content>
                    </Kbd>
                )}

                {hasChildren && (
                    <ChevronDownIcon
                        className={`mx-1 h-4 w-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                        } ${isParentSoftActive ? 'text-accent' : ''}`}
                    />
                )}
            </span>
        </>
    );

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link?: string) => {
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
            return;
        }
        if (link && link !== '#') {
            e.preventDefault();
            onNavigate(link);
        }
    };

    return (
        <li className="relative">
            <div className="group relative flex items-center">
                {hasChildren ? (
                    <button
                        type="button"
                        onClick={handleExpandToggle}
                        className={`${commonClasses} flex-1 text-left`}
                    >
                        {content}
                    </button>
                ) : (
                    <a
                        href={item.link || '#'}
                        className={`${commonClasses} flex-1`}
                        onClick={(e) => handleLinkClick(e, item.link)}
                    >
                        {content}
                    </a>
                )}

                {/* Favorite Star - Sibling to avoid DOM nesting errors */}
                {item.id && !hasChildren && (
                    <div className="absolute right-4 z-10 flex items-center">
                        <FavoriteButton
                            id={item.id}
                            isFavorite={isFavorite}
                            isActive={isSolidActive}
                            onToggleFavorite={onToggleFavorite}
                        />
                    </div>
                )}
            </div>

            {hasChildren && isOpen && (
                <ul className="border-separator mt-2 ml-5 space-y-0.5 border-l-2">
                    {item.children?.map((subItem) => {
                        const isSubActive = isLinkActive(subItem.link);
                        return (
                            <li key={subItem.id || subItem.title}>
                                <a
                                    href={subItem.link || '#'}
                                    onClick={(e) => handleLinkClick(e, subItem.link)}
                                    className={`mx-2 flex items-center gap-2.5 rounded-full py-1.5 pr-3 pl-2.5 text-left text-sm transition-all duration-200 ${
                                        isSubActive
                                            ? 'bg-accent text-accent-foreground shadow-accent/25 font-medium shadow-md'
                                            : 'text-muted hover:bg-default/40 hover:text-foreground'
                                    }`}
                                >
                                    <span
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                                            isSubActive
                                                ? 'bg-accent-foreground/20 text-accent-foreground'
                                                : 'text-muted group-hover:text-accent'
                                        }`}
                                    >
                                        <MenuIcon
                                            icon={subItem.icon}
                                            id={subItem.id}
                                            title={subItem.title}
                                            className="h-3.5 w-3.5 shrink-0"
                                        />
                                    </span>
                                    <span className="truncate">{t(subItem.title)}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
});

import { CN, JP, KR, TH, US, VN } from 'country-flag-icons/react/3x2';

const languages = [
    { code: 'en', name: 'English', Flag: US },
    { code: 'vi', name: 'Tiếng Việt', Flag: VN },
    { code: 'ja', name: '日本語', Flag: JP },
    { code: 'zh', name: '中文', Flag: CN },
    { code: 'ko', name: '한국어', Flag: KR },
    { code: 'th', name: 'ไทย', Flag: TH },
];

const FAVORITES_KEY = 'sidebar-favorites';

const GROUP_TITLES: Record<string, string> = {
    main: 'common.module.dashboard',
    management: 'common.module.projectManagement',
    hr: 'common.module.humanResources',
    sales: 'common.module.sales',
    inventory: 'common.module.inventory',
    purchase: 'common.module.purchasing',
    crm: 'common.module.crm',
    marketing: 'menu.group.marketing',
    accounting: 'common.module.financeAccounting',
    it: 'menu.group.it',
    documents: 'common.module.documentManagement',
    content: 'menu.group.content',
    apps: 'menu.group.apps',
    communication: 'menu.group.communication',
    workflow: 'common.module.workflow',
    reports: 'common.module.reports',
    system: 'common.module.system',
};

// Main Navbar Component
export function Navbar() {
    const t = useTranslations();
    const { navbarOpen, closeNavbar } = useNavbarContext();
    const { menuData, isLoading } = useNavbar();
    const location = useLocation();
    const navigate = useNavigate();
    const router = useRouter();
    const pathname = location.pathname;
    const locale = useLocale();

    const [langOpen, setLangOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const deferredSearchQuery = useDeferredValue(searchQuery);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isMac, setIsMac] = useState(false);

    // Detect OS: Windows (Ctrl) vs macOS (Cmd)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userAgent = window.navigator.userAgent;
            const platform =
                (window.navigator as unknown as { userAgentData?: { platform?: string } })
                    .userAgentData?.platform || window.navigator.platform;
            setIsMac(/Mac|iPhone|iPod|iPad/i.test(userAgent) || /Mac/i.test(platform));
        }
    }, []);

    // Tập hợp toàn bộ link có trong cây menu để phục vụ Exact Match First
    const allMenuLinks = useMemo(() => {
        const links = new Set<string>();
        for (const item of menuData) {
            if (item.link && item.link !== '#') {
                links.add(item.link);
            }
            if (item.children) {
                for (const child of item.children) {
                    if (child.link && child.link !== '#') {
                        links.add(child.link);
                    }
                }
            }
        }
        return links;
    }, [menuData]);

    // Generate stable keys for skeleton loading
    const skeletonKeys = useMemo(
        () => Array.from({ length: 10 }).map(() => crypto.randomUUID()),
        []
    );

    const handleNavigate = useCallback(
        (path: string) => {
            if (window.innerWidth < 1024) {
                closeNavbar();
            }
            if (path && path !== '#') {
                navigate(path);
            }
        },
        [closeNavbar, navigate]
    );

    // Load favorites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(FAVORITES_KEY);
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    // Save favorites to localStorage
    const toggleFavorite = useCallback((id: string) => {
        setFavorites((prev) => {
            const newFavorites = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            return newFavorites;
        });
    }, []);

    // Language dropdown ref and click-outside handler
    const langRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setLangOpen(false);
            }
        };
        if (langOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [langOpen]);

    const currentLang = languages.find((l) => l.code === locale) || languages[0];

    // Filter menu items based on search using deferred query
    const filteredMenu = menuData.filter((item) => {
        if (!deferredSearchQuery) return true;
        const title = t(item.title).toLowerCase();
        const query = deferredSearchQuery.toLowerCase();
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
            if ((e.ctrlKey || e.metaKey) && /^\d$/.test(e.key)) {
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
    }, [handleNavigate, menuData]);

    return (
        <aside
            className={`sidebar-transition bg-surface text-surface-foreground lg:border-border fixed top-16 left-0 z-40 flex h-[calc(100vh-4rem)] flex-col overflow-hidden shadow-lg transition-all duration-300 ease-in-out lg:relative lg:top-0 lg:m-3 lg:h-[calc(100vh-5.5rem)] lg:rounded-xl lg:border ${
                navbarOpen
                    ? 'w-full translate-x-0 opacity-100 lg:w-64'
                    : '-translate-x-full opacity-0 lg:w-0 lg:translate-x-0'
            }`}
        >
            {/* Search Box */}
            <div className="border-separator border-b p-2.5">
                <SearchField
                    name="menu-search"
                    variant="secondary"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    aria-label={t('common.global.lbl.search')}
                    className="w-full"
                >
                    <SearchField.Group className="w-full rounded-full">
                        <SearchField.SearchIcon />
                        <SearchField.Input
                            placeholder={t('common.global.lbl.search') + '...'}
                            className="w-full text-sm"
                        />
                        <SearchField.ClearButton />
                    </SearchField.Group>
                </SearchField>
            </div>

            <nav className="flex-1 overflow-x-hidden overflow-y-auto py-4">
                {isLoading ? (
                    <div className="space-y-2 p-4">
                        {skeletonKeys.map((key) => (
                            <Skeleton key={key} className="h-10 w-full rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Favorites Section */}
                        {favoriteItems.length > 0 && (
                            <div className="mb-4">
                                <div className="mb-2 flex items-center gap-2 px-4">
                                    <StarIconSolid className="text-warning h-4 w-4" />
                                    <span className="text-muted text-xs font-semibold tracking-wider uppercase">
                                        {t('common.favorites')}
                                    </span>
                                </div>
                                <ul className="space-y-1">
                                    {favoriteItems.map((item) => (
                                        <NavbarItemComponent
                                            key={`fav-${item.id || item.title}`}
                                            item={item}
                                            onNavigate={handleNavigate}
                                            currentPath={pathname}
                                            allMenuLinks={allMenuLinks}
                                            isFavorite={true}
                                            onToggleFavorite={toggleFavorite}
                                            badgeCount={item.id ? badgeCounts[item.id] : undefined}
                                            isMac={isMac}
                                        />
                                    ))}
                                </ul>
                                <div className="border-separator mx-4 my-3 border-t"></div>
                            </div>
                        )}

                        {/* Menu Items - Rendered from API tree */}
                        {deferredSearchQuery ? (
                            <ul className="space-y-0.5">
                                {regularItems.map((item) => (
                                    <NavbarItemComponent
                                        key={item.id || item.title}
                                        item={item}
                                        onNavigate={handleNavigate}
                                        currentPath={pathname}
                                        allMenuLinks={allMenuLinks}
                                        isFavorite={item.id ? favorites.includes(item.id) : false}
                                        onToggleFavorite={toggleFavorite}
                                        badgeCount={item.id ? badgeCounts[item.id] : undefined}
                                        isMac={isMac}
                                    />
                                ))}
                            </ul>
                        ) : (
                            Object.entries(
                                regularItems.reduce<Record<string, NavbarItem[]>>((acc, item) => {
                                    const groupKey = item.group || 'other';
                                    if (!acc[groupKey]) acc[groupKey] = [];
                                    acc[groupKey].push(item);
                                    return acc;
                                }, {})
                            ).map(([groupKey, items]) => (
                                <div key={groupKey} className="mb-3">
                                    {/* Section Header */}
                                    <div className="border-separator bg-surface sticky -top-4 z-10 mb-1 border-b px-4 pb-1">
                                        <span className="text-muted text-[10px] font-bold tracking-widest uppercase">
                                            {GROUP_TITLES[groupKey]
                                                ? t(GROUP_TITLES[groupKey])
                                                : groupKey.toUpperCase()}
                                        </span>
                                    </div>
                                    {/* Section Items */}
                                    <ul className="space-y-0.5">
                                        {items.map((item) => (
                                            <NavbarItemComponent
                                                key={item.id || item.title}
                                                item={item}
                                                onNavigate={handleNavigate}
                                                currentPath={pathname}
                                                allMenuLinks={allMenuLinks}
                                                isFavorite={
                                                    item.id ? favorites.includes(item.id) : false
                                                }
                                                onToggleFavorite={toggleFavorite}
                                                badgeCount={
                                                    item.id ? badgeCounts[item.id] : undefined
                                                }
                                                isMac={isMac}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </>
                )}

                {/* No Results */}
                {filteredMenu.length === 0 && (
                    <div className="text-muted px-4 py-8 text-center text-sm">
                        {t('common.global.lbl.noResults')}
                    </div>
                )}
            </nav>

            {/* Compact Footer: Language + Version + Copyright */}
            <div className="border-separator border-t px-3 py-2">
                <div className="relative flex items-center justify-between">
                    {/* Language Selector - Compact */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <div className="hover:bg-default/40 flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-all duration-200 focus:outline-none">
                                <currentLang.Flag
                                    title={currentLang.name}
                                    className="h-4 w-5 rounded-sm"
                                />
                                <ChevronDownIcon className="text-muted h-3 w-3 transition-transform" />
                            </div>
                        </Dropdown.Trigger>
                        <Dropdown.Popover placement="top start">
                            <Dropdown.Menu
                                aria-label="Language selection"
                                className="min-w-32"
                                onAction={(key) => {
                                    Cookies.set('locale', key as string);
                                    router.refresh();
                                }}
                            >
                                {languages
                                    .toSorted((a, b) => a.name.localeCompare(b.name))
                                    .map((lang) => (
                                        <Dropdown.Item key={lang.code} textValue={lang.name}>
                                            <div className="flex w-full items-center gap-2.5">
                                                <lang.Flag
                                                    title={lang.name}
                                                    className="h-4 w-5 rounded-sm"
                                                />
                                                <span className="text-foreground">{lang.name}</span>
                                            </div>
                                        </Dropdown.Item>
                                    ))}
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>

                    {/* Version & Copyright */}
                    <div className="text-muted text-right text-[10px] tabular-nums">
                        <span>v1.0.0</span>
                        <span className="mx-1">&bull;</span>
                        <span>&copy; 2024 Phuong Tran</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
