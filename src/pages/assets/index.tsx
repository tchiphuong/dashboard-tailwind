import { Breadcrumb } from '@/components/layout';

export function AssetsList() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Assets', href: '#' }, { label: 'List' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Assets List
                </h1>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-600 dark:bg-zinc-800">
                <p className="text-gray-600 dark:text-gray-300">Assets list page coming soon...</p>
            </div>
        </>
    );
}

export function AssetsRequests() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Assets', href: '#' }, { label: 'Requests' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Asset Requests
                </h1>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-600 dark:bg-zinc-800">
                <p className="text-gray-600 dark:text-gray-300">
                    Asset requests page coming soon...
                </p>
            </div>
        </>
    );
}
