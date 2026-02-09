import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Avatar, SelectItem, Form } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
    Select,
    PageHeader,
    Modal as CommonModal,
    ConfirmModal,
    Table,
    Input,
    TableColumn,
    TableAction,
    useTableData,
    FetchParams,
    PagedResult,
} from '@/components/common';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    image: string;
    role: string;
    company: {
        name: string;
        department: string;
        title: string;
    };
    address: {
        city: string;
        country: string;
    };
}

interface UsersApiResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}

// Custom fetch function for DummyJSON API
const fetchUsers = async (params: FetchParams): Promise<PagedResult<User>> => {
    const skip = (params.page - 1) * params.pageSize;
    const url = params.search
        ? `https://dummyjson.com/users/search?q=${params.search}&limit=${params.pageSize}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${params.pageSize}&skip=${skip}`;

    const res = await fetch(url);
    const data: UsersApiResponse = await res.json();

    return {
        items: data.users,
        paging: {
            pageIndex: params.page,
            pageSize: params.pageSize,
            totalItems: data.total,
            totalPages: Math.ceil(data.total / params.pageSize),
        },
    };
};

export function UsersList() {
    const { t } = useTranslation();

    // Use the custom hook for data fetching
    const {
        items: users,
        isLoading: loading,
        total,
        page,
        pageSize,
        search,
        sortDescriptor,
        filters,
        setPage,
        setPageSize,
        setSearch,
        setSortDescriptor,
        setFilters,
        refresh,
    } = useTableData<User>({
        fetchFn: fetchUsers,
        initialPageSize: 10,
    });

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [actionLoading, setActionLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<User>>({});
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Visible columns state (for column toggle)
    const INITIAL_VISIBLE_COLUMNS = ['id', 'user', 'email', 'phone', 'role', 'company'] as const;
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    // Helper function for role colors
    const getRoleColor = useCallback(
        (role: string): 'primary' | 'success' | 'warning' | 'danger' => {
            switch (role?.toLowerCase()) {
                case 'admin':
                    return 'danger';
                case 'moderator':
                    return 'warning';
                default:
                    return 'primary';
            }
        },
        []
    );

    // Define table columns
    const columns: TableColumn<User>[] = useMemo(
        () => [
            {
                key: 'id',
                label: 'ID',
                width: 60,
                render: (user) => (
                    <span className="text-gray-500 dark:text-gray-400">#{user.id}</span>
                ),
            },
            {
                key: 'user',
                label: t('users.columns.user'),
                render: (user) => (
                    <div className="flex items-center gap-3">
                        <Avatar src={user.image} alt={user.firstName} size="sm" isBordered />
                        <div className="min-w-0">
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                @{user.username}
                            </p>
                        </div>
                    </div>
                ),
            },
            {
                key: 'email',
                label: t('users.columns.email'),
                sortable: true,
                render: (user) => (
                    <span className="block truncate text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                    </span>
                ),
            },
            {
                key: 'phone',
                label: t('users.columns.phone'),
                render: (user) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300">{user.phone}</span>
                ),
            },
            {
                key: 'role',
                label: t('users.columns.role'),
                width: 100,
                filterable: true,
                filterType: 'select' as const,
                filterOptions: [
                    { key: 'admin', label: 'Admin' },
                    { key: 'moderator', label: 'Moderator' },
                    { key: 'user', label: 'User' },
                ],
                render: (user) => (
                    <Chip size="sm" variant="flat" color={getRoleColor(user.role)}>
                        {user.role}
                    </Chip>
                ),
            },
            {
                key: 'company',
                label: t('users.columns.company'),
                render: (user) => (
                    <div className="min-w-0">
                        <p className="truncate text-sm text-gray-800 dark:text-gray-200">
                            {user.company?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.company?.title || 'N/A'}
                        </p>
                    </div>
                ),
            },
            {
                key: 'location',
                label: t('users.columns.location'),
                width: 120,
                render: (user) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {user.address?.city || 'N/A'}
                    </span>
                ),
            },
        ],
        [getRoleColor, t]
    );

    // Define table actions
    const actions: TableAction<User>[] = useMemo(
        () => [
            {
                key: 'view',
                label: 'View',
                onClick: () => {
                    // Handle view
                },
            },
            {
                key: 'edit',
                label: t('common.edit'),
                onClick: (user: User) => handleEdit(user),
            },
            {
                key: 'delete',
                label: t('common.delete'),
                onClick: (user: User) => handleDeleteClick(user),
            },
        ],
        [t]
    );

    // CRUD Handlers
    const handleAdd = () => {
        setModalMode('create');
        setSelectedUser(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            username: '',
            role: 'user',
            image: `https://i.pravatar.cc/150?u=${Date.now()}`,
            company: { name: 'Acme Inc', department: 'Engineering', title: 'Developer' },
            address: { city: 'New York', country: 'USA' },
        });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({ ...user });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors: { [key: string]: string } = {};
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.username) errors.username = 'Username is required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setActionLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsModalOpen(false);
            refresh(); // Refresh data after save
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        setActionLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsDeleteOpen(false);
            refresh(); // Refresh data after delete
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <>
            <PageHeader
                title={t('pages.usersList')}
                breadcrumbs={[{ label: t('menu.users') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={handleAdd}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                        className="font-medium"
                    >
                        {t('users.add')}
                    </Button>
                }
            />

            {/* Table with integrated search/filter/pagination */}
            <Table
                items={users}
                columns={columns}
                getRowKey={(user) => user.id}
                actions={actions}
                isLoading={loading}
                enableSkeleton={true}
                emptyContent="No users found"
                // Scroll
                isHeaderSticky
                maxHeight="382px"
                // Search
                showSearch
                searchPlaceholder={t('common.search') + '...'}
                searchValue={search}
                onSearchChange={setSearch}
                // Filters
                showFilters
                filters={filters}
                onFilterChange={setFilters}
                // Refresh
                showRefresh
                onRefresh={refresh}
                // Pagination
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                // Sorting
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                // Column visibility
                showColumnToggle
                visibleColumns={visibleColumns}
                onVisibleColumnsChange={setVisibleColumns}
            />

            {/* Add/Edit User Modal */}
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? t('users.add') : t('users.edit')}
                footer={
                    <>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={() => setIsModalOpen(false)}
                            radius="full"
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleSubmit as any}
                            isLoading={actionLoading}
                            radius="full"
                        >
                            {t('common.save')}
                        </Button>
                    </>
                }
            >
                <Form onSubmit={handleSubmit} validationBehavior="native" className="w-full">
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                isRequired
                                label={t('users.form.firstName')}
                                placeholder="Enter first name"
                                value={formData.firstName || ''}
                                onValueChange={(val) =>
                                    setFormData({ ...formData, firstName: val })
                                }
                                errorMessage={formErrors.firstName}
                                isInvalid={!!formErrors.firstName}
                                radius="full"
                                variant="bordered"
                            />
                            <Input
                                isRequired
                                label={t('users.form.lastName')}
                                placeholder="Enter last name"
                                value={formData.lastName || ''}
                                onValueChange={(val) => setFormData({ ...formData, lastName: val })}
                                errorMessage={formErrors.lastName}
                                isInvalid={!!formErrors.lastName}
                                radius="full"
                                variant="bordered"
                            />
                        </div>
                        <Input
                            isRequired
                            type="email"
                            label={t('users.form.email')}
                            placeholder="Enter email"
                            value={formData.email || ''}
                            onValueChange={(val) => setFormData({ ...formData, email: val })}
                            errorMessage={formErrors.email}
                            isInvalid={!!formErrors.email}
                            radius="full"
                            variant="bordered"
                        />
                        <Input
                            isRequired
                            label={t('users.form.username')}
                            placeholder="Enter username"
                            value={formData.username || ''}
                            onValueChange={(val) => setFormData({ ...formData, username: val })}
                            errorMessage={formErrors.username}
                            isInvalid={!!formErrors.username}
                            radius="full"
                            variant="bordered"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label={t('users.form.phone')}
                                placeholder="Enter phone"
                                value={formData.phone || ''}
                                onValueChange={(val) => setFormData({ ...formData, phone: val })}
                                radius="full"
                                variant="bordered"
                            />
                            <Select
                                label={t('users.form.role')}
                                defaultSelectedKeys={formData.role ? [formData.role] : ['user']}
                                onSelectionChange={(keys) =>
                                    setFormData({
                                        ...formData,
                                        role: Array.from(keys)[0] as string,
                                    })
                                }
                                radius="full"
                                variant="bordered"
                            >
                                <SelectItem key="admin">Admin</SelectItem>
                                <SelectItem key="moderator">Moderator</SelectItem>
                                <SelectItem key="user">User</SelectItem>
                            </Select>
                        </div>
                    </div>
                </Form>
            </CommonModal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('users.deleteConfirmTitle')}
                message={t('users.deleteConfirm')}
                isLoading={actionLoading}
            />
        </>
    );
}
