import { useState, useEffect, useCallback, useRef } from 'react';
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
    ArchiveBoxIcon,
    UserGroupIcon,
    ClockIcon,
    BanknotesIcon,
    CalendarDaysIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    ShoppingCartIcon,
    BuildingStorefrontIcon,
    TruckIcon,
    HeartIcon,
    MegaphoneIcon,
    CalculatorIcon,
    WrenchScrewdriverIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import {
    StarIcon as StarIconSolid,
    HomeIcon as HomeIconSolid,
    FolderOpenIcon as FolderOpenIconSolid,
    UsersIcon as UsersIconSolid,
    CubeIcon as CubeIconSolid,
    DocumentTextIcon as DocumentTextIconSolid,
    CurrencyDollarIcon as CurrencyDollarIconSolid,
    Cog6ToothIcon as Cog6ToothIconSolid,
    CheckCircleIcon as CheckCircleIconSolid,
    ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
    ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
    ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
    ArchiveBoxIcon as ArchiveBoxIconSolid,
    UserGroupIcon as UserGroupIconSolid,
    ClockIcon as ClockIconSolid,
    BanknotesIcon as BanknotesIconSolid,
    CalendarDaysIcon as CalendarDaysIconSolid,
    BriefcaseIcon as BriefcaseIconSolid,
    AcademicCapIcon as AcademicCapIconSolid,
    ShoppingCartIcon as ShoppingCartIconSolid,
    BuildingStorefrontIcon as BuildingStorefrontIconSolid,
    TruckIcon as TruckIconSolid,
    HeartIcon as HeartIconSolid,
    MegaphoneIcon as MegaphoneIconSolid,
    CalculatorIcon as CalculatorIconSolid,
    WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
    DocumentDuplicateIcon as DocumentDuplicateIconSolid,
} from '@heroicons/react/24/solid';
import { useSidebar } from '@/contexts/SidebarContext';
import { MenuItem } from '@/types';

// Icon mapping - outline versions
const iconComponentsOutline: Record<string, React.ComponentType<{ className?: string }>> = {
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
    'fa-archive': ArchiveBoxIcon,
    'fa-user-group': UserGroupIcon,
    'fa-clock': ClockIcon,
    'fa-banknotes': BanknotesIcon,
    'fa-calendar': CalendarDaysIcon,
    'fa-briefcase': BriefcaseIcon,
    'fa-graduation-cap': AcademicCapIcon,
    'fa-shopping-cart': ShoppingCartIcon,
    'fa-store': BuildingStorefrontIcon,
    'fa-truck': TruckIcon,
    'fa-heart': HeartIcon,
    'fa-megaphone': MegaphoneIcon,
    'fa-calculator': CalculatorIcon,
    'fa-wrench': WrenchScrewdriverIcon,
    'fa-copy': DocumentDuplicateIcon,
};

// Icon mapping - solid versions (for active state)
const iconComponentsSolid: Record<string, React.ComponentType<{ className?: string }>> = {
    'fa-tachometer-alt': HomeIconSolid,
    'fa-folder-open': FolderOpenIconSolid,
    'fa-users': UsersIconSolid,
    'fa-box': CubeIconSolid,
    'fa-file-alt': DocumentTextIconSolid,
    'fa-dollar-sign': CurrencyDollarIconSolid,
    'fa-cogs': Cog6ToothIconSolid,
    'fa-check-square': CheckCircleIconSolid,
    'fa-comments': ChatBubbleLeftRightIconSolid,
    'fa-quote-left': ChatBubbleBottomCenterTextIconSolid,
    'fa-clipboard-check': ClipboardDocumentCheckIconSolid,
    'fa-archive': ArchiveBoxIconSolid,
    'fa-user-group': UserGroupIconSolid,
    'fa-clock': ClockIconSolid,
    'fa-banknotes': BanknotesIconSolid,
    'fa-calendar': CalendarDaysIconSolid,
    'fa-briefcase': BriefcaseIconSolid,
    'fa-graduation-cap': AcademicCapIconSolid,
    'fa-shopping-cart': ShoppingCartIconSolid,
    'fa-store': BuildingStorefrontIconSolid,
    'fa-truck': TruckIconSolid,
    'fa-heart': HeartIconSolid,
    'fa-megaphone': MegaphoneIconSolid,
    'fa-calculator': CalculatorIconSolid,
    'fa-wrench': WrenchScrewdriverIconSolid,
    'fa-copy': DocumentDuplicateIconSolid,
};

// Menu data with translation keys - organized by groups
const menuData: MenuItem[] = [
    // MAIN
    {
        id: 'dashboard',
        title: 'menu.dashboard',
        icon: 'fa-tachometer-alt',
        shortcut: '1',
        description: 'View analytics and system overview',
        group: 'main',
        children: [
            { title: 'menu.overview', link: '/dashboard' },
            { title: 'menu.analytics', link: '/dashboard/analytics' },
        ],
    },
    // MANAGEMENT
    {
        id: 'projects',
        title: 'menu.projects',
        icon: 'fa-folder-open',
        shortcut: '2',
        description: 'Manage your projects',
        group: 'management',
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
        group: 'management',
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
        group: 'management',
        link: '/products',
    },
    {
        id: 'assets',
        title: 'menu.assets',
        icon: 'fa-archive',
        shortcut: '7',
        description: 'Asset management system',
        group: 'management',
        children: [
            { title: 'menu.assetList', link: '/assets' },
            { title: 'menu.requests', link: '/assets/requests' },
        ],
    },
    // HR - Human Resources
    {
        id: 'employees',
        title: 'menu.employees',
        icon: 'fa-user-group',
        description: 'Employee management',
        group: 'hr',
        children: [
            { title: 'menu.employeeList', link: '/hr/employees' },
            { title: 'menu.orgChart', link: '/hr/org-chart' },
        ],
    },
    {
        id: 'attendance',
        title: 'menu.attendance',
        icon: 'fa-clock',
        description: 'Time and attendance tracking',
        group: 'hr',
        children: [
            { title: 'menu.checkIn', link: '/hr/attendance/check-in' },
            { title: 'menu.attendanceHistory', link: '/hr/attendance/history' },
        ],
    },
    {
        id: 'payroll',
        title: 'menu.payroll',
        icon: 'fa-banknotes',
        description: 'Payroll and salary management',
        group: 'hr',
        children: [
            { title: 'menu.salarySheet', link: '/hr/payroll/salary' },
            { title: 'menu.advances', link: '/hr/payroll/advances' },
        ],
    },
    {
        id: 'leave',
        title: 'menu.leave',
        icon: 'fa-calendar',
        description: 'Leave and time-off management',
        group: 'hr',
        children: [
            { title: 'menu.leaveRequest', link: '/hr/leave/request' },
            { title: 'menu.leaveApprove', link: '/hr/leave/approve' },
        ],
    },
    {
        id: 'recruitment',
        title: 'menu.recruitment',
        icon: 'fa-briefcase',
        description: 'Recruitment and hiring',
        group: 'hr',
        children: [
            { title: 'menu.jobPostings', link: '/hr/recruitment/jobs' },
            { title: 'menu.candidates', link: '/hr/recruitment/candidates' },
        ],
    },
    {
        id: 'training',
        title: 'menu.training',
        icon: 'fa-graduation-cap',
        description: 'Training and development',
        group: 'hr',
        children: [
            { title: 'menu.courses', link: '/hr/training/courses' },
            { title: 'menu.myLearning', link: '/hr/training/my-learning' },
        ],
    },
    // SALES
    {
        id: 'orders',
        title: 'menu.orders',
        icon: 'fa-shopping-cart',
        description: 'Order management',
        group: 'sales',
        children: [
            { title: 'menu.orderList', link: '/sales/orders' },
            { title: 'menu.createOrder', link: '/sales/orders/new' },
        ],
    },
    {
        id: 'customers',
        title: 'menu.customers',
        icon: 'fa-users',
        description: 'Customer management',
        group: 'sales',
        children: [
            { title: 'menu.customerList', link: '/sales/customers' },
            { title: 'menu.addCustomer', link: '/sales/customers/new' },
        ],
    },
    {
        id: 'salesQuotes',
        title: 'menu.salesQuotes',
        icon: 'fa-file-alt',
        description: 'Sales quotes and proposals',
        group: 'sales',
        link: '/sales/quotes',
    },
    // INVENTORY
    {
        id: 'stock',
        title: 'menu.stock',
        icon: 'fa-store',
        description: 'Stock management',
        group: 'inventory',
        children: [
            { title: 'menu.stockOverview', link: '/inventory/stock' },
            { title: 'menu.stockAdjustment', link: '/inventory/stock/adjustment' },
        ],
    },
    {
        id: 'warehouses',
        title: 'menu.warehouses',
        icon: 'fa-archive',
        description: 'Warehouse management',
        group: 'inventory',
        link: '/inventory/warehouses',
    },
    {
        id: 'transfers',
        title: 'menu.transfers',
        icon: 'fa-truck',
        description: 'Stock transfers',
        group: 'inventory',
        link: '/inventory/transfers',
    },
    // PURCHASE
    {
        id: 'purchaseOrders',
        title: 'menu.purchaseOrders',
        icon: 'fa-clipboard-check',
        description: 'Purchase order management',
        group: 'purchase',
        children: [
            { title: 'menu.poList', link: '/purchase/orders' },
            { title: 'menu.createPO', link: '/purchase/orders/new' },
        ],
    },
    {
        id: 'suppliers',
        title: 'menu.suppliers',
        icon: 'fa-truck',
        description: 'Supplier management',
        group: 'purchase',
        link: '/purchase/suppliers',
    },
    {
        id: 'receipts',
        title: 'menu.receipts',
        icon: 'fa-file-alt',
        description: 'Goods receipts',
        group: 'purchase',
        link: '/purchase/receipts',
    },
    // CRM
    {
        id: 'leads',
        title: 'menu.leads',
        icon: 'fa-heart',
        description: 'Lead management',
        group: 'crm',
        children: [
            { title: 'menu.leadList', link: '/crm/leads' },
            { title: 'menu.addLead', link: '/crm/leads/new' },
        ],
    },
    {
        id: 'opportunities',
        title: 'menu.opportunities',
        icon: 'fa-briefcase',
        description: 'Sales opportunities',
        group: 'crm',
        link: '/crm/opportunities',
    },
    {
        id: 'contacts',
        title: 'menu.contacts',
        icon: 'fa-user-group',
        description: 'Contact management',
        group: 'crm',
        link: '/crm/contacts',
    },
    // MARKETING
    {
        id: 'campaigns',
        title: 'menu.campaigns',
        icon: 'fa-megaphone',
        description: 'Marketing campaigns',
        group: 'marketing',
        children: [
            { title: 'menu.campaignList', link: '/marketing/campaigns' },
            { title: 'menu.createCampaign', link: '/marketing/campaigns/new' },
        ],
    },
    {
        id: 'emailMarketing',
        title: 'menu.emailMarketing',
        icon: 'fa-file-alt',
        description: 'Email marketing',
        group: 'marketing',
        link: '/marketing/email',
    },
    {
        id: 'socialMedia',
        title: 'menu.socialMedia',
        icon: 'fa-comments',
        description: 'Social media management',
        group: 'marketing',
        link: '/marketing/social',
    },
    // ACCOUNTING
    {
        id: 'chartOfAccounts',
        title: 'menu.chartOfAccounts',
        icon: 'fa-calculator',
        description: 'Chart of accounts',
        group: 'accounting',
        link: '/accounting/chart',
    },
    {
        id: 'journalEntries',
        title: 'menu.journalEntries',
        icon: 'fa-file-alt',
        description: 'Journal entries',
        group: 'accounting',
        children: [
            { title: 'menu.journalList', link: '/accounting/journal' },
            { title: 'menu.newEntry', link: '/accounting/journal/new' },
        ],
    },
    {
        id: 'generalLedger',
        title: 'menu.generalLedger',
        icon: 'fa-dollar-sign',
        description: 'General ledger',
        group: 'accounting',
        link: '/accounting/ledger',
    },
    // IT
    {
        id: 'tickets',
        title: 'menu.tickets',
        icon: 'fa-wrench',
        description: 'IT support tickets',
        group: 'it',
        children: [
            { title: 'menu.ticketList', link: '/it/tickets' },
            { title: 'menu.newTicket', link: '/it/tickets/new' },
        ],
    },
    {
        id: 'itAssets',
        title: 'menu.itAssets',
        icon: 'fa-box',
        description: 'IT asset management',
        group: 'it',
        link: '/it/assets',
    },
    {
        id: 'knowledgeBase',
        title: 'menu.knowledgeBase',
        icon: 'fa-file-alt',
        description: 'Knowledge base articles',
        group: 'it',
        link: '/it/knowledge',
    },
    // DOCUMENTS
    {
        id: 'files',
        title: 'menu.files',
        icon: 'fa-copy',
        description: 'File management',
        group: 'documents',
        children: [
            { title: 'menu.allFiles', link: '/documents/files' },
            { title: 'menu.myFiles', link: '/documents/files/my' },
        ],
    },
    {
        id: 'templates',
        title: 'menu.templates',
        icon: 'fa-file-alt',
        description: 'Document templates',
        group: 'documents',
        link: '/documents/templates',
    },
    {
        id: 'signatures',
        title: 'menu.signatures',
        icon: 'fa-check-square',
        description: 'Digital signatures',
        group: 'documents',
        link: '/documents/signatures',
    },
    // CONTENT
    {
        id: 'posts',
        title: 'menu.posts',
        icon: 'fa-file-alt',
        shortcut: '5',
        description: 'Blog posts and articles',
        group: 'content',
        link: '/posts',
    },
    {
        id: 'comments',
        title: 'menu.comments',
        icon: 'fa-comments',
        description: 'User comments and feedback',
        group: 'content',
        link: '/comments',
    },
    {
        id: 'quotes',
        title: 'menu.quotes',
        icon: 'fa-quote-left',
        description: 'Inspirational quotes',
        group: 'content',
        link: '/quotes',
    },
    // WORKFLOW
    {
        id: 'approvals',
        title: 'menu.approvals',
        icon: 'fa-clipboard-check',
        shortcut: '6',
        description: 'Approval management',
        group: 'workflow',
        children: [
            { title: 'menu.submitRequest', link: '/approvals/submit' },
            { title: 'menu.approve', link: '/approvals/approve' },
            { title: 'menu.pending', link: '/approvals/pending' },
            { title: 'menu.history', link: '/approvals/history' },
        ],
    },
    {
        id: 'todos',
        title: 'menu.todos',
        icon: 'fa-check-square',
        description: 'Task management',
        group: 'workflow',
        link: '/todos',
    },
    // REPORTS
    {
        id: 'finance',
        title: 'menu.finance',
        icon: 'fa-dollar-sign',
        shortcut: '8',
        description: 'Financial reports and invoices',
        group: 'reports',
        children: [
            { title: 'menu.budget', link: '/finance/budgets' },
            { title: 'menu.invoices', link: '/finance/invoices' },
        ],
    },
    // SYSTEM
    {
        id: 'settings',
        title: 'menu.settings',
        icon: 'fa-cogs',
        shortcut: '0',
        description: 'System configuration',
        group: 'system',
        link: '/settings',
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

    const isActive =
        item.link === currentPath ||
        (hasChildren && item.children?.some((child) => child.link === currentPath));

    // Use solid icon when active, outline when not
    const IconComponent = item.icon
        ? isActive
            ? iconComponentsSolid[item.icon]
            : iconComponentsOutline[item.icon]
        : null;

    const handleClick = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        } else if (item.link) {
            onNavigate(item.link);
        }
    };

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

                {/* Regular Menu Items - Grouped */}
                {(() => {
                    // Group labels for i18n
                    const groupLabels: Record<string, string> = {
                        main: 'menu.group.main',
                        management: 'menu.group.management',
                        hr: 'menu.group.hr',
                        sales: 'menu.group.sales',
                        inventory: 'menu.group.inventory',
                        purchase: 'menu.group.purchase',
                        crm: 'menu.group.crm',
                        marketing: 'menu.group.marketing',
                        accounting: 'menu.group.accounting',
                        it: 'menu.group.it',
                        documents: 'menu.group.documents',
                        content: 'menu.group.content',
                        workflow: 'menu.group.workflow',
                        reports: 'menu.group.reports',
                        system: 'menu.group.system',
                    };

                    // Group order
                    const groupOrder = [
                        'main',
                        'management',
                        'hr',
                        'sales',
                        'inventory',
                        'purchase',
                        'crm',
                        'marketing',
                        'accounting',
                        'it',
                        'documents',
                        'content',
                        'workflow',
                        'reports',
                        'system',
                    ];

                    // Group regular items by their group
                    const groupedItems = groupOrder.reduce(
                        (acc, group) => {
                            acc[group] = regularItems.filter((item) => item.group === group);
                            return acc;
                        },
                        {} as Record<string, typeof regularItems>
                    );

                    return groupOrder.map((group) => {
                        const items = groupedItems[group];
                        if (!items || items.length === 0) return null;

                        return (
                            <div key={group} className="mb-2">
                                {/* Group Header - Sticky */}
                                <div className="sticky -top-4 z-10 mb-1 border-b border-gray-100 bg-white px-4 pb-1 dark:border-gray-700 dark:bg-gray-800">
                                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                                        {t(groupLabels[group]) || group.toUpperCase()}
                                    </span>
                                </div>
                                {/* Group Items */}
                                <ul className="space-y-0.5">
                                    {items.map((item, index) => (
                                        <SidebarMenuItem
                                            key={`${group}-${index}`}
                                            item={item}
                                            onNavigate={handleNavigate}
                                            currentPath={location.pathname}
                                            isFavorite={
                                                item.id ? favorites.includes(item.id) : false
                                            }
                                            onToggleFavorite={toggleFavorite}
                                            badgeCount={item.id ? badgeCounts[item.id] : undefined}
                                        />
                                    ))}
                                </ul>
                            </div>
                        );
                    });
                })()}

                {/* No Results */}
                {filteredMenu.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('common.noResults') || 'No results found'}
                    </div>
                )}
            </nav>

            {/* Compact Footer: Language + Version + Copyright */}
            <div className="border-t border-gray-200 px-3 py-2 dark:border-gray-700">
                <div className="relative flex items-center justify-between">
                    {/* Language Selector - Compact */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        >
                            <img
                                src={currentLang.flag}
                                alt={currentLang.name}
                                className="h-4 w-4 rounded-full object-cover"
                            />
                            <ChevronDownIcon
                                className={`h-3 w-3 text-gray-400 transition-transform ${langOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {langOpen && (
                            <div className="absolute bottom-full left-0 z-20 mb-2 min-w-32 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                {languages
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .filter((lang) => lang.code !== i18n.language)
                                    .map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        >
                                            <img
                                                src={lang.flag}
                                                alt={lang.name}
                                                className="h-5 w-5 rounded-full object-cover"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {lang.name}
                                            </span>
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Version & Copyright */}
                    <div className="text-right text-[10px] text-gray-400 dark:text-gray-500">
                        <span>v1.0.0</span>
                        <span className="mx-1">•</span>
                        <span>© 2024 Phuong Tran</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
