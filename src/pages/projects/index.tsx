import { Breadcrumb } from '@/components/layout';

export function ProjectsList() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Projects', href: '#' }, { label: 'List' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Projects List
                </h1>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-600 dark:bg-zinc-800">
                <p className="text-gray-600 dark:text-gray-300">
                    Projects list page coming soon...
                </p>
            </div>
        </>
    );
}

export function ProjectsCreate() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Projects', href: '#' }, { label: 'Create' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Create Project
                </h1>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-600 dark:bg-zinc-800">
                <p className="text-gray-600 dark:text-gray-300">
                    Create project page coming soon...
                </p>
            </div>
        </>
    );
}
