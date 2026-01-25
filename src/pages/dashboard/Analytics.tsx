import { Breadcrumb } from '@/components/layout';

export function DashboardAnalytics() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Dashboard', href: '#' }, { label: 'Analytics' }]} />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Analytics
                </h1>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300">
                    Analytics dashboard coming soon...
                </p>
            </div>
        </>
    );
}
