import { Breadcrumb } from '@/components/layout';

export { UsersList } from './List';

export function UsersRoles() {
    return (
        <>
            <Breadcrumb items={[{ label: 'Users', href: '#' }, { label: 'Roles' }]} />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    User Roles
                </h1>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-300">User roles page coming soon...</p>
            </div>
        </>
    );
}
