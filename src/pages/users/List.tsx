import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Chip,
    Pagination,
    Select,
    SelectItem,
    Avatar,
    Form,
} from '@heroui/react';
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, Modal as CommonModal, ConfirmModal } from '@/components/common';

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

interface UsersResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}

const rowsPerPageOptions = [
    { key: '5', label: '5 rows' },
    { key: '10', label: '10 rows' },
    { key: '20', label: '20 rows' },
    { key: '50', label: '50 rows' },
];

export function UsersList() {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [actionLoading, setActionLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<User>>({});
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (page - 1) * rowsPerPage;
            const url = search
                ? `https://dummyjson.com/users/search?q=${search}&limit=${rowsPerPage}&skip=${skip}`
                : `https://dummyjson.com/users?limit=${rowsPerPage}&skip=${skip}`;

            const res = await fetch(url);
            const data: UsersResponse = await res.json();
            setUsers(data.users);
            setTotal(data.total);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, search]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleRowsPerPageChange = (keys: Set<string> | string) => {
        const value = typeof keys === 'string' ? keys : Array.from(keys)[0] || '10';
        setRowsPerPage(Number(value));
        setPage(1);
    };

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

        // Simple validation
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (modalMode === 'create') {
                const newUser = {
                    ...formData,
                    id: Date.now(), // Fake ID
                } as User;

                // Optimistic update
                setUsers([newUser, ...users]);
                setTotal((prev) => prev + 1);
            } else {
                setUsers(
                    users.map((u) =>
                        u.id === selectedUser?.id ? ({ ...u, ...formData } as User) : u
                    )
                );
            }

            setIsModalOpen(false);
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Optimistic update
            setUsers(users.filter((u) => u.id !== selectedUser.id));
            setTotal((prev) => prev - 1);
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const totalPages = Math.ceil(total / rowsPerPage);

    const getRoleColor = (role: string): 'primary' | 'success' | 'warning' | 'danger' => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'danger';
            case 'moderator':
                return 'warning';
            default:
                return 'primary';
        }
    };

    return (
        <>
            <PageHeader
                title={t('pages.usersList')}
                breadcrumbs={[{ label: t('menu.users') }]}
                actions={
                    <>
                        <Button
                            color="primary"
                            onPress={handleAdd}
                            startContent={<PlusIcon className="h-4 w-4" />}
                            radius="full"
                            className="font-medium"
                        >
                            {t('users.add')}
                        </Button>
                        <Button
                            variant="bordered"
                            startContent={
                                <ArrowPathIcon
                                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                                />
                            }
                            onPress={loadUsers}
                            isLoading={loading}
                            radius="full"
                            className="font-medium"
                        >
                            {t('common.refresh')}
                        </Button>
                    </>
                }
            />

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <Input
                    isClearable
                    className="w-full sm:max-w-xs"
                    placeholder={t('common.search') + '...'}
                    startContent={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                    value={search}
                    onClear={() => handleSearchChange('')}
                    onValueChange={handleSearchChange}
                    variant="bordered"
                    radius="full"
                />
                <Select
                    className="w-full sm:max-w-[140px]"
                    selectedKeys={[String(rowsPerPage)]}
                    onSelectionChange={(keys) => handleRowsPerPageChange(keys as Set<string>)}
                    variant="bordered"
                    radius="full"
                >
                    {rowsPerPageOptions.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>
                <div className="flex-1 self-center text-right text-sm text-gray-500 dark:text-gray-400">
                    Total: <strong>{total}</strong> users
                </div>
            </div>

            {/* Table */}
            <Table
                aria-label="Users table"
                isStriped
                classNames={{
                    wrapper: 'rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700',
                    th: 'bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-300',
                }}
                bottomContent={
                    totalPages > 0 && (
                        <div className="flex items-center justify-between px-2 py-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {(page - 1) * rowsPerPage + 1} -{' '}
                                {Math.min(page * rowsPerPage, total)} of {total}
                            </span>
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={totalPages}
                                onChange={setPage}
                                radius="full"
                            />
                        </div>
                    )
                }
                bottomContentPlacement="outside"
            >
                <TableHeader>
                    <TableColumn width={60}>ID</TableColumn>
                    <TableColumn>USER</TableColumn>
                    <TableColumn width={150}>EMAIL</TableColumn>
                    <TableColumn width={120}>PHONE</TableColumn>
                    <TableColumn width={100}>ROLE</TableColumn>
                    <TableColumn>COMPANY</TableColumn>
                    <TableColumn width={120}>LOCATION</TableColumn>
                    <TableColumn width={120}>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                    items={users}
                    isLoading={loading}
                    loadingContent={
                        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
                    }
                    emptyContent="No users found"
                >
                    {(user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <span className="text-gray-500 dark:text-gray-400">#{user.id}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={user.image}
                                        alt={user.firstName}
                                        size="sm"
                                        isBordered
                                    />
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="block max-w-[140px] truncate text-sm text-gray-600 dark:text-gray-300">
                                    {user.email}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {user.phone}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color={getRoleColor(user.role)}>
                                    {user.role}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="min-w-0">
                                    <p className="max-w-[150px] truncate text-sm text-gray-800 dark:text-gray-200">
                                        {user.company?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.company?.title || 'N/A'}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {user.address?.city || 'N/A'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        radius="full"
                                        aria-label="View"
                                    >
                                        <EyeIcon className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        radius="full"
                                        aria-label="Edit"
                                        onPress={() => handleEdit(user)}
                                    >
                                        <PencilIcon className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        radius="full"
                                        aria-label="Delete"
                                        onPress={() => handleDeleteClick(user)}
                                    >
                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

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
