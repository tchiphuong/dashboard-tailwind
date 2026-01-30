import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Card, Button } from '@/components/common';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    UserGroupIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { RoleModal } from './components/RoleModal';
import { INITIAL_ROLES, Role } from './roles-data';

export function RolesPage() {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

    // Confirm Modal state
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    const handleCreate = () => {
        setEditingRole(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setRoleToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (roleToDelete) {
            setRoles((prev) => prev.filter((r) => r.id !== roleToDelete));
        }
        setIsConfirmOpen(false);
        setRoleToDelete(null);
    };

    const handleSave = (roleData: Omit<Role, 'id' | 'usersCount'> & { id?: number }) => {
        if (roleData.id) {
            // Edit existing
            setRoles((prev) =>
                prev.map((r) =>
                    r.id === roleData.id
                        ? { ...r, ...roleData, usersCount: r.usersCount } // Preserve usersCount
                        : r
                )
            );
        } else {
            // Create new
            const newRole: Role = {
                ...roleData,
                id: Math.max(...roles.map((r) => r.id)) + 1,
                usersCount: 0,
            };
            setRoles((prev) => [...prev, newRole]);
        }
    };

    return (
        <>
            <PageHeader
                title={t('menu.roles')}
                description={t('users.roles.description')}
                breadcrumbs={[
                    { label: t('menu.users'), href: '/users' },
                    { label: t('menu.roles') },
                ]}
                actions={
                    <Button
                        onPress={handleCreate}
                        color="primary"
                        startContent={<PlusIcon className="h-5 w-5" />}
                    >
                        {t('users.roles.add')}
                    </Button>
                }
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {roles.map((role) => (
                    <Card key={role.id} className="group flex flex-col justify-between">
                        <div>
                            <div className="mb-4 flex items-start justify-between">
                                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                    <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                {!role.isSystem && (
                                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onPress={() => handleEdit(role)}
                                            className="text-gray-400 hover:text-blue-600"
                                            title={t('users.roles.edit')}
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onPress={() => handleDeleteClick(role.id)}
                                            className="text-gray-400 hover:text-red-600"
                                            title={t('users.roles.delete')}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                {role.name}
                            </h3>
                            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                {role.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-700">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                <UserGroupIcon className="h-4 w-4" />
                                <span>
                                    {t('users.roles.usersCount', { count: role.usersCount })}
                                </span>
                            </div>
                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-zinc-700 dark:text-gray-300">
                                {t('users.roles.permsCount', { count: role.permissions.length })}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            <RoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                role={editingRole}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('users.roles.deleteConfirmTitle')}
                message={t('users.roles.deleteConfirm')}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                type="danger"
            />
        </>
    );
}
