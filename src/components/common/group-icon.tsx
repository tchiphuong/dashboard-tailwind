import { MenuIcon } from './menu-icon';
import {
    AcademicCapIcon,
    AdjustmentsHorizontalIcon,
    ArchiveBoxIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    ArrowUturnLeftIcon,
    ArrowsRightLeftIcon,
    BanknotesIcon,
    Bars3Icon,
    BoltIcon,
    BookOpenIcon,
    BriefcaseIcon,
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    BuildingOfficeIcon,
    CalculatorIcon,
    CalendarDaysIcon,
    CalendarIcon,
    ChartBarIcon,
    ChartBarSquareIcon,
    ChartPieIcon,
    ChatBubbleBottomCenterTextIcon,
    CheckBadgeIcon,
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentIcon,
    ClockIcon,
    Cog8ToothIcon,
    CommandLineIcon,
    ComputerDesktopIcon,
    CpuChipIcon,
    CreditCardIcon,
    CubeIcon,
    CurrencyBangladeshiIcon,
    CurrencyDollarIcon,
    DocumentChartBarIcon,
    DocumentDuplicateIcon,
    DocumentMagnifyingGlassIcon,
    DocumentTextIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    FlagIcon,
    FolderOpenIcon,
    GiftIcon,
    GlobeAltIcon,
    HandThumbUpIcon,
    HashtagIcon,
    HomeIcon,
    HomeModernIcon,
    IdentificationIcon,
    InboxArrowDownIcon,
    InboxStackIcon,
    LifebuoyIcon,
    LightBulbIcon,
    LinkIcon,
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
    TrophyIcon,
    TruckIcon,
    UserGroupIcon,
    UserMinusIcon,
    UserPlusIcon,
    UsersIcon,
    ViewColumnsIcon,
    WalletIcon,
    WindowIcon,
    WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

interface GroupIconProps {
    resourceKey: string;
    className?: string;
}

export const GroupIcon = ({ resourceKey, className }: GroupIconProps) => {
    switch (resourceKey) {
        case "func.group.am.assets":
            return <BuildingOfficeIcon className={className} />;
        case "func.group.am.assignment":
            return <ClipboardDocumentCheckIcon className={className} />;
        case "func.group.am.inventory":
            return <CubeIcon className={className} />;
        case "func.group.am.maintenance":
            return <WrenchScrewdriverIcon className={className} />;
        case "func.group.am.reports":
            return <ChartBarSquareIcon className={className} />;
        case "func.group.cr.activities":
            return <CalendarDaysIcon className={className} />;
        case "func.group.cr.campaign":
            return <MegaphoneIcon className={className} />;
        case "func.group.cr.customerService":
            return <PhoneIcon className={className} />;
        case "func.group.cr.lead":
            return <UserPlusIcon className={className} />;
        case "func.group.cr.opportunity":
            return <LightBulbIcon className={className} />;
        case "func.group.db.myWorkspace":
            return <ComputerDesktopIcon className={className} />;
        case "func.group.db.overview":
            return <Squares2X2Icon className={className} />;
        case "func.group.db.quickReports":
            return <BoltIcon className={className} />;
        case "func.group.dm.approval":
            return <CheckBadgeIcon className={className} />;
        case "func.group.dm.categories":
            return <FolderOpenIcon className={className} />;
        case "func.group.dm.documents":
            return <DocumentDuplicateIcon className={className} />;
        case "func.group.dm.search":
            return <MagnifyingGlassIcon className={className} />;
        case "func.group.fi.accountsPayable":
            return <ArrowDownTrayIcon className={className} />;
        case "func.group.fi.accountsReceivable":
            return <ArrowUpTrayIcon className={className} />;
        case "func.group.fi.bank":
            return <BuildingLibraryIcon className={className} />;
        case "func.group.fi.budget":
            return <ChartPieIcon className={className} />;
        case "func.group.fi.cash":
            return <BanknotesIcon className={className} />;
        case "func.group.fi.fixedAssets":
            return <HomeModernIcon className={className} />;
        case "func.group.fi.generalLedger":
            return <BookOpenIcon className={className} />;
        case "func.group.fi.reports":
            return <PresentationChartLineIcon className={className} />;
        case "func.group.hr.attendance":
            return <ClockIcon className={className} />;
        case "func.group.hr.employee":
            return <IdentificationIcon className={className} />;
        case "func.group.hr.leave":
            return <SunIcon className={className} />;
        case "func.group.hr.overtime":
            return <MoonIcon className={className} />;
        case "func.group.hr.payroll":
            return <CurrencyDollarIcon className={className} />;
        case "func.group.hr.performance":
            return <TrophyIcon className={className} />;
        case "func.group.hr.recruitment":
            return <MagnifyingGlassPlusIcon className={className} />;
        case "func.group.hr.reports":
            return <ChartBarIcon className={className} />;
        case "func.group.hr.training":
            return <AcademicCapIcon className={className} />;
        case "func.group.iv.issuing":
            return <PaperAirplaneIcon className={className} />;
        case "func.group.iv.lotSerial":
            return <QrCodeIcon className={className} />;
        case "func.group.iv.receiving":
            return <InboxArrowDownIcon className={className} />;
        case "func.group.iv.reports":
            return <DocumentChartBarIcon className={className} />;
        case "func.group.iv.stockCount":
            return <CalculatorIcon className={className} />;
        case "func.group.iv.transfer":
            return <ArrowsRightLeftIcon className={className} />;
        case "func.group.ms.assets":
            return <HomeIcon className={className} />;
        case "func.group.ms.businessPartners":
            return <UsersIcon className={className} />;
        case "func.group.ms.common":
            return <GlobeAltIcon className={className} />;
        case "func.group.ms.finance":
            return <CurrencyBangladeshiIcon className={className} />;
        case "func.group.ms.humanResources":
            return <UserGroupIcon className={className} />;
        case "func.group.ms.inventory":
            return <ArchiveBoxIcon className={className} />;
        case "func.group.ms.organization":
            return <BuildingOffice2Icon className={className} />;
        case "func.group.ms.production":
            return <CpuChipIcon className={className} />;
        case "func.group.ms.projects":
            return <RocketLaunchIcon className={className} />;
        case "func.group.ms.purchasing":
            return <CreditCardIcon className={className} />;
        case "func.group.ms.quality":
            return <ShieldCheckIcon className={className} />;
        case "func.group.ms.sales":
            return <ShoppingBagIcon className={className} />;
        case "func.group.pm.cost":
            return <WalletIcon className={className} />;
        case "func.group.pm.execution":
            return <PlayIcon className={className} />;
        case "func.group.pm.planning":
            return <MapIcon className={className} />;
        case "func.group.pm.project":
            return <BriefcaseIcon className={className} />;
        case "func.group.pm.reports":
            return <PresentationChartBarIcon className={className} />;
        case "func.group.pr.finishedGoods":
            return <GiftIcon className={className} />;
        case "func.group.pr.materialIssue":
            return <InboxStackIcon className={className} />;
        case "func.group.pr.planning":
            return <CalendarIcon className={className} />;
        case "func.group.pr.productionOrder":
            return <DocumentTextIcon className={className} />;
        case "func.group.pr.reports":
            return <ViewColumnsIcon className={className} />;
        case "func.group.pr.shopFloor":
            return <LifebuoyIcon className={className} />;
        case "func.group.pu.goodsReceipt":
            return <CheckCircleIcon className={className} />;
        case "func.group.pu.purchaseOrder":
            return <ClipboardDocumentIcon className={className} />;
        case "func.group.pu.purchaseRequest":
            return <QuestionMarkCircleIcon className={className} />;
        case "func.group.pu.reports":
            return <QueueListIcon className={className} />;
        case "func.group.pu.rfq":
            return <ChatBubbleBottomCenterTextIcon className={className} />;
        case "func.group.pu.supplierReturn":
            return <ArrowUturnLeftIcon className={className} />;
        case "func.group.qm.finalInspection":
            return <FlagIcon className={className} />;
        case "func.group.qm.inProcessInspection":
            return <EyeIcon className={className} />;
        case "func.group.qm.incomingInspection":
            return <MagnifyingGlassCircleIcon className={className} />;
        case "func.group.qm.nonConformance":
            return <ExclamationTriangleIcon className={className} />;
        case "func.group.qm.reports":
            return <ExclamationCircleIcon className={className} />;
        case "func.group.rp.customReports":
            return <PencilSquareIcon className={className} />;
        case "func.group.rp.financialReports":
            return <WindowIcon className={className} />;
        case "func.group.rp.managementReports":
            return <TableCellsIcon className={className} />;
        case "func.group.rp.operationalReports":
            return <Cog8ToothIcon className={className} />;
        case "func.group.sa.delivery":
            return <TruckIcon className={className} />;
        case "func.group.sa.invoice":
            return <ReceiptPercentIcon className={className} />;
        case "func.group.sa.quotation":
            return <DocumentMagnifyingGlassIcon className={className} />;
        case "func.group.sa.reports":
            return <NewspaperIcon className={className} />;
        case "func.group.sa.return":
            return <ReceiptRefundIcon className={className} />;
        case "func.group.sa.salesOrder":
            return <ShoppingCartIcon className={className} />;
        case "func.group.sy.audit":
            return <ClipboardDocumentCheckIcon className={className} />;
        case "func.group.sy.configuration":
            return <AdjustmentsHorizontalIcon className={className} />;
        case "func.group.sy.integration":
            return <LinkIcon className={className} />;
        case "func.group.sy.navigation":
            return <Bars3Icon className={className} />;
        case "func.group.sy.numbering":
            return <HashtagIcon className={className} />;
        case "func.group.sy.security":
            return <LockClosedIcon className={className} />;
        case "func.group.sy.templates":
            return <RectangleGroupIcon className={className} />;
        case "func.group.sy.utilities":
            return <CommandLineIcon className={className} />;
        case "func.group.wf.approval":
            return <HandThumbUpIcon className={className} />;
        case "func.group.wf.delegation":
            return <UserMinusIcon className={className} />;
        case "func.group.wf.workflow":
            return <QueueListIcon className={className} />;
        default:
            return <MenuIcon resourceKey={resourceKey} className={className} />;
    }
};
