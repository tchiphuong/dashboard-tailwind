import { useTranslation } from 'react-i18next';

// INVENTORY
export function StockOverviewPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.stockOverview')} subtitle="Stock Overview" />;
}
export function StockAdjustmentPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.stockAdjustment')} subtitle="Stock Adjustment" />;
}
export function WarehousesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.warehouses')} subtitle="Warehouse Management" />;
}
export function TransfersPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.transfers')} subtitle="Stock Transfers" />;
}

// PURCHASE
export function PurchaseOrderListPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.poList')} subtitle="Purchase Orders" />;
}
export function CreatePurchaseOrderPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.createPO')} subtitle="Create Purchase Order" />;
}
export function SuppliersPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.suppliers')} subtitle="Supplier Management" />;
}
export function ReceiptsPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.receipts')} subtitle="Goods Receipts" />;
}

// Reusable Placeholder Component
function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                <p className="text-gray-500 dark:text-gray-400">{subtitle} - Coming Soon...</p>
            </div>
        </>
    );
}
