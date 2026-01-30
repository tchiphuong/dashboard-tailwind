import { Breadcrumb } from '@/components/layout';

export function DashboardAnalytics() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Dashboard', href: '#' }, { label: 'Analytics' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Analytics
                </h1>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-600 dark:bg-zinc-800">
                <p className="text-gray-600 dark:text-gray-300">
                    Analytics dashboard coming soon...
                </p>
            </div>
        </>
    );
}
