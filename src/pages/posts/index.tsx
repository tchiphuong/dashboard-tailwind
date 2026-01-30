import { Breadcrumb } from '@/components/layout';

export function PostsList() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Posts', href: '#' }, { label: 'List' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Posts List
                </h1>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-600 dark:bg-zinc-800">
                <p className="text-gray-600 dark:text-gray-300">Posts list page coming soon...</p>
            </div>
        </>
    );
}
