'use client';

import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ConfirmModal, Table, TableColumn, TableAction, Chip, Input } from '@/components/common';
import { PageHeader } from '@/components/page-header-i18n';
import { useDebounce } from '@/hooks/use-debounce';
import { Role, RoleService } from '@/services/role.service';

import { RoleModal } from './components/role-modal';

// Icon components
const EditIcon = (props: any) => <Icon icon="solar:pen-bold" {...props} />;
const DeleteIcon = (props: any) => <Icon icon="solar:trash-bin-trash-bold" {...props} />;

export default function RolesPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 500);

    // Modal State
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const onOpen = () => setIsOpen(true);

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Confirm Delete State
    const [deleteCode, setDeleteCode] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['roles', pageIndex, pageSize, debouncedKeyword],
        queryFn: () =>
            RoleService.list({
                pageIndex,
                pageSize,
                keyword: debouncedKeyword,
            }),
    });

    const deleteMutation = useMutation({
        mutationFn: (roleCodes: string[]) => RoleService.delete(roleCodes),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            addToast({
                title: 'Success',
                description: data?.message || 'Role deleted successfully',
                color: 'success',
            });
            setDeleteCode(null);
            setIsDeleteOpen(false);
        },
        onError: (error) => {
            console.error('Delete failed', error);
            addToast({
                title: 'Error',
                description: (error as any)?.message || 'Failed to delete role',
                color: 'danger',
            });
        },
    });

    const handleCreate = () => {
        setSelectedRole(null);
        onOpen();
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        onOpen();
    };

    const handleDeleteClick = (code: string) => {
        setDeleteCode(code);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (deleteCode) {
            deleteMutation.mutate([deleteCode]);
        }
    };

    const columns: TableColumn<Role>[] = [
        {
            key: 'roleCode',
            label: 'Role Code',
            sortable: true,
        },
        {
            key: 'roleName',
            label: 'Role Name',
            sortable: true,
        },
        {
            key: 'description',
            label: 'Description',
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (role: Role) => (
                <Chip
                    className="capitalize"
                    color={role.isActive === 1 ? 'success' : 'danger'}
                    size="sm"
                    variant="soft"
                >
                    {role.isActive === 1 ? 'Active' : 'Inactive'}
                </Chip>
            ),
        },
        {
            key: 'createdAt',
            label: 'Created At',
            sortable: true,
            render: (role: Role) => (role.createdAt ? new Date(role.createdAt).toLocaleDateString('vi-VN') : '-'),
        },
    ];

    const actions: TableAction<Role>[] = [
        {
            key: 'edit',
            label: 'Edit',
            icon: <EditIcon className="size-4" />,
            onClick: (role) => handleEdit(role),
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteIcon className="size-4" />,
            color: 'danger',
            onClick: (role) => handleDeleteClick(role.roleCode),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Roles Management"
                description="Manage system roles and permissions"
                action={{
                    label: 'Add Role',
                    onClick: handleCreate,
                }}
            />

            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row">
                    <div className="relative w-full sm:max-w-[44%]">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2">
                            <Icon icon="solar:magnifer-linear" className="text-default-400" />
                        </div>
                        <Input
                            className="w-full pl-10"
                            placeholder="Search roles..."
                            value={keyword}
                            onChange={(e: any) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    items={data?.data?.items || []}
                    getRowKey={(item) => item.roleCode}
                    isLoading={isLoading}
                    pagination={{
                        page: pageIndex,
                        pageSize: pageSize,
                        total: data?.data?.paging?.totalItems || 0,
                        onPageChange: setPageIndex,
                        onPageSizeChange: setPageSize,
                    }}
                    actions={actions}
                />
            </div>

            <RoleModal isOpen={isOpen} onClose={onClose} role={selectedRole} />

            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message={`Are you sure you want to delete role "${deleteCode}"?`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isLoading={deleteMutation.isPending}
                variant="danger"
            />
        </div>
    );
}
