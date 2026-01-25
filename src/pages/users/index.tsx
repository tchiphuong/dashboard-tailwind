import { Breadcrumb } from '@/components/layout';

export { UsersList } from './List';

export function UsersRoles() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Users', href: '#' }, { label: 'Roles' }]} />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    User Roles
                </h1>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300">
                    User roles page coming soon...
                </p>
            </div>
        </>
    );
}
