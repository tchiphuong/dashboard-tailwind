import React from 'react';
import { Icon } from '@iconify/react';
import {
    AcademicCapIcon,
    AdjustmentsHorizontalIcon,
    ArchiveBoxIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon,
    ArrowRightOnRectangleIcon,
    ArrowUpTrayIcon,
    ArrowsRightLeftIcon,
    BanknotesIcon,
    Bars3Icon,
    BellIcon,
    BoltIcon,
    BookOpenIcon,
    BriefcaseIcon,
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    BuildingOfficeIcon,
    BuildingStorefrontIcon,
    CalculatorIcon,
    CalendarDaysIcon,
    CalendarIcon,
    ChartBarIcon,
    ChartBarSquareIcon,
    ChartPieIcon,
    ChatBubbleBottomCenterTextIcon,
    ChatBubbleLeftRightIcon,
    CheckBadgeIcon,
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    Cog6ToothIcon,
    Cog8ToothIcon,
    CommandLineIcon,
    ComputerDesktopIcon,
    CpuChipIcon,
    CreditCardIcon,
    CubeIcon,
    CurrencyDollarIcon,
    DocumentArrowDownIcon,
    DocumentChartBarIcon,
    DocumentCheckIcon,
    DocumentCurrencyDollarIcon,
    DocumentDuplicateIcon,
    DocumentMagnifyingGlassIcon,
    DocumentPlusIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    FlagIcon,
    FolderArrowDownIcon,
    FolderIcon,
    FolderOpenIcon,
    GiftIcon,
    GlobeAltIcon,
    HandThumbUpIcon,
    HashtagIcon,
    HeartIcon,
    HomeIcon,
    HomeModernIcon,
    IdentificationIcon,
    InboxArrowDownIcon,
    InboxStackIcon,
    LifebuoyIcon,
    LightBulbIcon,
    LinkIcon,
    ListBulletIcon,
    LockClosedIcon,
    MagnifyingGlassCircleIcon,
    MagnifyingGlassIcon,
    MagnifyingGlassPlusIcon,
    MapIcon,
    MegaphoneIcon,
    MoonIcon,
    NewspaperIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    PhoneIcon,
    PlayIcon,
    PlusCircleIcon,
    PresentationChartBarIcon,
    PresentationChartLineIcon,
    QrCodeIcon,
    QuestionMarkCircleIcon,
    QueueListIcon,
    ReceiptPercentIcon,
    ReceiptRefundIcon,
    RectangleGroupIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    Squares2X2Icon,
    SunIcon,
    TableCellsIcon,
    TagIcon,
    TicketIcon,
    TrophyIcon,
    TruckIcon,
    UserCircleIcon,
    UserGroupIcon,
    UserMinusIcon,
    UserPlusIcon,
    UsersIcon,
    ViewColumnsIcon,
    WalletIcon,
    WindowIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

export interface MenuIconProps {
    icon?: string;
    id?: string;
    resourceKey?: string;
    title?: string;
    className?: string;
}

// Bảng ánh xạ theo Heroicons tĩnh chạy 100% offline
const HEROICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    // Dashboard & Overview
    Squares2X2Icon,
    HomeIcon,
    ChartBarSquareIcon,
    ChartBarIcon,
    PresentationChartLineIcon,
    PresentationChartBarIcon,
    BoltIcon,
    ComputerDesktopIcon,

    // Projects & Management
    FolderOpenIcon,
    FolderIcon,
    FolderArrowDownIcon,
    BriefcaseIcon,
    RocketLaunchIcon,
    ListBulletIcon,
    PlusCircleIcon,

    // Users & HR
    UsersIcon,
    UserGroupIcon,
    UserCircleIcon,
    UserPlusIcon,
    UserMinusIcon,
    IdentificationIcon,
    ShieldCheckIcon,
    ClockIcon,
    BanknotesIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    CalendarDaysIcon,
    AcademicCapIcon,
    TrophyIcon,

    // Products & Inventory & Assets
    CubeIcon,
    ArchiveBoxIcon,
    BuildingOfficeIcon,
    BuildingOffice2Icon,
    BuildingStorefrontIcon,
    TruckIcon,
    ArrowsRightLeftIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    QrCodeIcon,

    // Sales & CRM & Purchasing
    ShoppingCartIcon,
    ShoppingBagIcon,
    CreditCardIcon,
    ReceiptPercentIcon,
    ReceiptRefundIcon,
    DocumentCurrencyDollarIcon,
    HeartIcon,
    PhoneIcon,
    MegaphoneIcon,
    LightBulbIcon,

    // Content, Documents & Workflow
    DocumentTextIcon,
    DocumentDuplicateIcon,
    DocumentPlusIcon,
    DocumentCheckIcon,
    DocumentChartBarIcon,
    DocumentArrowDownIcon,
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    CheckBadgeIcon,
    PencilSquareIcon,
    ViewColumnsIcon,
    NewspaperIcon,

    // Communication & Apps
    ChatBubbleLeftRightIcon,
    ChatBubbleBottomCenterTextIcon,
    EnvelopeIcon,
    BellIcon,
    PaperAirplaneIcon,
    TableCellsIcon,

    // IT & System
    WrenchScrewdriverIcon,
    CpuChipIcon,
    CommandLineIcon,
    TicketIcon,
    BookOpenIcon,
    Cog6ToothIcon,
    Cog8ToothIcon,
    AdjustmentsHorizontalIcon,
    LockClosedIcon,
    QuestionMarkCircleIcon,
    MagnifyingGlassIcon,
    HashtagIcon,
    LinkIcon,
    Bars3Icon,
    ArrowPathIcon,
    ArrowRightOnRectangleIcon,

    // Additional Utility Icons
    BuildingLibraryIcon,
    DocumentMagnifyingGlassIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    FlagIcon,
    GiftIcon,
    GlobeAltIcon,
    HandThumbUpIcon,
    HomeModernIcon,
    InboxArrowDownIcon,
    InboxStackIcon,
    LifebuoyIcon,
    MagnifyingGlassCircleIcon,
    MagnifyingGlassPlusIcon,
    MapIcon,
    MoonIcon,
    PlayIcon,
    QueueListIcon,
    SunIcon,
    TagIcon,
    WalletIcon,
    WindowIcon,
};

// Bảng ánh xạ theo ID hoặc Resource Key
const KEY_TO_HEROICON: Record<string, React.ComponentType<{ className?: string }>> = {
    // Menu IDs
    dashboard: Squares2X2Icon,
    overview: Squares2X2Icon,
    analytics: PresentationChartLineIcon,
    projects: FolderOpenIcon,
    users: UsersIcon,
    products: CubeIcon,
    assets: BuildingOffice2Icon,
    employees: UserGroupIcon,
    attendance: ClockIcon,
    payroll: BanknotesIcon,
    leave: CalendarDaysIcon,
    recruitment: BriefcaseIcon,
    training: AcademicCapIcon,
    orders: ShoppingCartIcon,
    customers: UsersIcon,
    salesquotes: DocumentTextIcon,
    salesQuotes: DocumentTextIcon,
    stock: CubeIcon,
    warehouses: BuildingStorefrontIcon,
    transfers: ArrowsRightLeftIcon,
    purchaseorders: ClipboardDocumentCheckIcon,
    purchaseOrders: ClipboardDocumentCheckIcon,
    suppliers: TruckIcon,
    receipts: DocumentArrowDownIcon,
    leads: HeartIcon,
    opportunities: LightBulbIcon,
    contacts: PhoneIcon,
    campaigns: MegaphoneIcon,
    emailmarketing: EnvelopeIcon,
    emailMarketing: EnvelopeIcon,
    socialmedia: ChatBubbleLeftRightIcon,
    socialMedia: ChatBubbleLeftRightIcon,
    chartofaccounts: CalculatorIcon,
    chartOfAccounts: CalculatorIcon,
    journalentries: DocumentTextIcon,
    journalEntries: DocumentTextIcon,
    generalledger: BanknotesIcon,
    generalLedger: BanknotesIcon,
    tickets: TicketIcon,
    itassets: CpuChipIcon,
    itAssets: CpuChipIcon,
    knowledgebase: BookOpenIcon,
    knowledgeBase: BookOpenIcon,
    files: DocumentDuplicateIcon,
    templates: RectangleGroupIcon,
    signatures: DocumentCheckIcon,
    posts: NewspaperIcon,
    comments: ChatBubbleBottomCenterTextIcon,
    quotes: DocumentTextIcon,
    chat: ChatBubbleLeftRightIcon,
    surveys: TableCellsIcon,
    notifications: BellIcon,
    approvals: CheckCircleIcon,
    todos: ClipboardDocumentCheckIcon,
    calendar: CalendarIcon,
    kanban: ViewColumnsIcon,
    finance: CurrencyDollarIcon,
    settings: Cog6ToothIcon,
    auditlog: ClipboardDocumentListIcon,
    auditLog: ClipboardDocumentListIcon,
    profile: UserCircleIcon,
    help: QuestionMarkCircleIcon,

    // Subitem titles / keys
    'menu.overview': ChartBarIcon,
    'menu.analytics': PresentationChartLineIcon,
    'menu.list': ListBulletIcon,
    'menu.createnew': PlusCircleIcon,
    'menu.roles': ShieldCheckIcon,
    'menu.assetlist': ArchiveBoxIcon,
    'menu.requests': DocumentPlusIcon,
    'menu.employeelist': UsersIcon,
    'menu.orgchart': RectangleGroupIcon,
    'menu.checkin': ArrowRightOnRectangleIcon,
    'menu.attendancehistory': ClockIcon,
    'menu.salarysheet': DocumentCurrencyDollarIcon,
    'menu.advances': BanknotesIcon,
    'menu.jobpostings': BriefcaseIcon,
    'menu.candidates': UserPlusIcon,
    'menu.courses': BookOpenIcon,
    'menu.mylearning': AcademicCapIcon,
    'menu.orderlist': ShoppingCartIcon,
    'menu.createorder': PlusCircleIcon,
    'menu.customerlist': IdentificationIcon,
    'menu.addcustomer': UserPlusIcon,
    'menu.stockoverview': CubeIcon,
    'menu.stockadjustment': AdjustmentsHorizontalIcon,
    'menu.polist': ClipboardDocumentListIcon,
    'menu.createpo': PlusCircleIcon,
    'menu.leadlist': HeartIcon,
    'menu.addlead': UserPlusIcon,
    'menu.campaignlist': MegaphoneIcon,
    'menu.createcampaign': PlusCircleIcon,
    'menu.journallist': DocumentTextIcon,
    'menu.newentry': PencilSquareIcon,
    'menu.ticketlist': TicketIcon,
    'menu.newticket': PlusCircleIcon,
    'menu.allfiles': FolderIcon,
    'menu.myfiles': FolderArrowDownIcon,
    'menu.submitrequest': PaperAirplaneIcon,
    'menu.approve': CheckCircleIcon,
    'menu.pending': ClockIcon,
    'menu.history': ArrowPathIcon,
    'menu.budget': ChartPieIcon,
    'menu.invoices': ReceiptPercentIcon,
    'menu.advancedreports': ChartBarSquareIcon,
    'menu.surveylist': TableCellsIcon,
    'menu.createsurvey': PlusCircleIcon,
    'menu.surveytemplates': DocumentDuplicateIcon,
    'menu.surveyanalytics': PresentationChartLineIcon,
};

export const MenuIcon = React.memo(function MenuIcon({
    icon,
    id,
    resourceKey,
    title,
    className = 'w-5 h-5',
}: MenuIconProps) {
    // 1. Nếu là chuỗi Iconify (bắt đầu bằng solar:, lucide:, mdi:, heroicons:...)
    if (icon && (icon.includes(':') || icon.startsWith('fa-'))) {
        if (icon.startsWith('fa-')) {
            // Chuyển mã icon fa cũ sang Heroicons nếu có
            const cleanFa = icon.replace('fa-', '').toLowerCase();
            if (cleanFa.includes('tachometer') || cleanFa.includes('dashboard')) return <Squares2X2Icon className={className} />;
            if (cleanFa.includes('folder')) return <FolderOpenIcon className={className} />;
            if (cleanFa.includes('users') || cleanFa.includes('user')) return <UsersIcon className={className} />;
            if (cleanFa.includes('box') || cleanFa.includes('archive')) return <CubeIcon className={className} />;
            if (cleanFa.includes('cart') || cleanFa.includes('shopping')) return <ShoppingCartIcon className={className} />;
            if (cleanFa.includes('clock')) return <ClockIcon className={className} />;
            if (cleanFa.includes('calendar')) return <CalendarDaysIcon className={className} />;
            if (cleanFa.includes('dollar') || cleanFa.includes('money') || cleanFa.includes('banknotes')) return <CurrencyDollarIcon className={className} />;
            if (cleanFa.includes('cog') || cleanFa.includes('settings')) return <Cog6ToothIcon className={className} />;
            if (cleanFa.includes('check') || cleanFa.includes('clipboard')) return <ClipboardDocumentCheckIcon className={className} />;
            if (cleanFa.includes('file') || cleanFa.includes('copy')) return <DocumentTextIcon className={className} />;
            if (cleanFa.includes('chart') || cleanFa.includes('poll')) return <ChartBarSquareIcon className={className} />;
            if (cleanFa.includes('bell')) return <BellIcon className={className} />;
            if (cleanFa.includes('comment') || cleanFa.includes('chat')) return <ChatBubbleLeftRightIcon className={className} />;
            if (cleanFa.includes('briefcase')) return <BriefcaseIcon className={className} />;
            if (cleanFa.includes('truck')) return <TruckIcon className={className} />;
            if (cleanFa.includes('graduation')) return <AcademicCapIcon className={className} />;
            if (cleanFa.includes('wrench')) return <WrenchScrewdriverIcon className={className} />;
            if (cleanFa.includes('quote')) return <DocumentTextIcon className={className} />;
            if (cleanFa.includes('question')) return <QuestionMarkCircleIcon className={className} />;
        } else {
            return <Icon icon={icon} className={className} />;
        }
    }

    // 2. Nếu tên icon khớp trực tiếp với Heroicons Component
    if (icon && HEROICONS_MAP[icon]) {
        const IconComponent = HEROICONS_MAP[icon];
        return <IconComponent className={className} />;
    }

    // 3. Khớp theo ID của menu item
    if (id) {
        const lowerId = id.toLowerCase();
        if (KEY_TO_HEROICON[lowerId]) {
            const IconComponent = KEY_TO_HEROICON[lowerId];
            return <IconComponent className={className} />;
        }
    }

    // 4. Khớp theo title hoặc resourceKey (dạng 'menu.xxx')
    const key = (resourceKey || title || '').toLowerCase();
    if (key && KEY_TO_HEROICON[key]) {
        const IconComponent = KEY_TO_HEROICON[key];
        return <IconComponent className={className} />;
    }

    // 5. Khớp lỏng nếu chứa từ khóa
    if (key.includes('overview')) return <ChartBarIcon className={className} />;
    if (key.includes('analytics')) return <PresentationChartLineIcon className={className} />;
    if (key.includes('list')) return <ListBulletIcon className={className} />;
    if (key.includes('create') || key.includes('new') || key.includes('add')) return <PlusCircleIcon className={className} />;
    if (key.includes('role')) return <ShieldCheckIcon className={className} />;
    if (key.includes('request')) return <DocumentPlusIcon className={className} />;
    if (key.includes('history')) return <ClockIcon className={className} />;
    if (key.includes('report')) return <ChartBarSquareIcon className={className} />;
    if (key.includes('setting')) return <Cog6ToothIcon className={className} />;

    // 6. Fallback an toàn, sắc nét
    return <Squares2X2Icon className={className} />;
});
