import { Breadcrumb } from '@/components/layout';

export function ProjectsList() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Projects', href: '#' }, { label: 'List' }]} />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Projects List
                </h1>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-600">
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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Create Project
                </h1>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300">
                    Create project page coming soon...
                </p>
            </div>
        </>
    );
}
