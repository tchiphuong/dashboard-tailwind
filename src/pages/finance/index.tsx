import { Breadcrumb } from '@/components/layout';

export function FinanceBudgets() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Finance', href: '#' }, { label: 'Budgets' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Budget Management
                </h1>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-300">
                    Budget management page coming soon...
                </p>
            </div>
        </>
    );
}

export function FinanceInvoices() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Finance', href: '#' }, { label: 'Invoices' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Invoices
                </h1>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-300">Invoices page coming soon...</p>
            </div>
        </>
    );
}
