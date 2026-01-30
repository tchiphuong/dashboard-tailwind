import { useTranslation } from 'react-i18next';

// SALES
export function OrdersListPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.orderList')} subtitle="Orders List" />;
}
export function CreateOrderPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.createOrder')} subtitle="Create New Order" />;
}
export function CustomersListPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.customerList')} subtitle="Customers List" />;
}
export function AddCustomerPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.addCustomer')} subtitle="Add New Customer" />;
}
export function SalesQuotesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.salesQuotes')} subtitle="Sales Quotes" />;
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
