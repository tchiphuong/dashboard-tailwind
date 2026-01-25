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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Form,
} from '@heroui/react';
import { MagnifyingGlassIcon, ArrowPathIcon, PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';

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
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
            address: { city: 'New York', country: 'USA' }
        });
        setFormErrors({});
        onOpen();
    };

    const handleEdit = (user: User) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({ ...user });
        setFormErrors({});
        onOpen();
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        const errors: { [key: string]: string } = {};
        if (!formData.firstName) errors.firstName = "First name is required";
        if (!formData.lastName) errors.lastName = "Last name is required";
        if (!formData.email) errors.email = "Email is required";
        if (!formData.username) errors.username = "Username is required";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setActionLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (modalMode === 'create') {
                const newUser = {
                    ...formData,
                    id: Date.now(), // Fake ID
                } as User;

                // Optimistic update
                setUsers([newUser, ...users]);
                setTotal(prev => prev + 1);
            } else {
                setUsers(users.map(u => u.id === selectedUser?.id ? { ...u, ...formData } as User : u));
            }

            onOpenChange(); // Close modal
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
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Optimistic update
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setTotal(prev => prev - 1);
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
            case 'admin': return 'danger';
            case 'moderator': return 'warning';
            default: return 'primary';
        }
    };

    return (
        <>
            <Breadcrumb items={[{ label: t('menu.users') }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('pages.usersList')}
                </h1>
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        onPress={handleAdd}
                        startContent={<PlusIcon className="w-4 h-4" />}
                        radius="full"
                        className="font-medium"
                    >
                        {t('users.add')}
                    </Button>
                    <Button
                        variant="bordered"
                        startContent={<ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                        onPress={loadUsers}
                        isLoading={loading}
                        radius="full"
                        className="font-medium"
                    >
                        {t('common.refresh')}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                    isClearable
                    className="w-full sm:max-w-xs"
                    placeholder={t('common.search') + '...'}
                    startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
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
                <div className="flex-1 text-right text-sm text-gray-500 dark:text-gray-400 self-center">
                    Total: <strong>{total}</strong> users
                </div>
            </div>

            {/* Table */}
            <Table
                aria-label="Users table"
                isStriped
                classNames={{
                    wrapper: 'rounded-xl shadow-lg border border-gray-200 dark:border-gray-700',
                    th: 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300',
                }}
                bottomContent={
                    totalPages > 0 && (
                        <div className="flex justify-between items-center px-2 py-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, total)} of {total}
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
                    loadingContent={<ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />}
                    emptyContent="No users found"
                >
                    {(user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <span className="text-gray-500 dark:text-gray-400">#{user.id}</span>
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[140px] block">
                                    {user.email}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{user.phone}</span>
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color={getRoleColor(user.role)}>
                                    {user.role}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="min-w-0">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
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
                                    <Button isIconOnly size="sm" variant="light" radius="full" aria-label="View">
                                        <EyeIcon className="w-4 h-4 text-gray-500" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        radius="full"
                                        aria-label="Edit"
                                        onPress={() => handleEdit(user)}
                                    >
                                        <PencilIcon className="w-4 h-4 text-blue-500" />
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
                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Add/Edit User Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                classNames={{
                    base: "rounded-2xl"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <Form onSubmit={handleSubmit} validationBehavior="native">
                            <ModalHeader className="flex flex-col gap-1">
                                {modalMode === 'create' ? t('users.add') : t('users.edit')}
                            </ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        isRequired
                                        label={t('users.form.firstName')}
                                        placeholder="Enter first name"
                                        value={formData.firstName || ''}
                                        onValueChange={(val) => setFormData({ ...formData, firstName: val })}
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
                                        onSelectionChange={(keys) => setFormData({ ...formData, role: Array.from(keys)[0] as string })}
                                        radius="full"
                                        variant="bordered"
                                    >
                                        <SelectItem key="admin">Admin</SelectItem>
                                        <SelectItem key="moderator">Moderator</SelectItem>
                                        <SelectItem key="user">User</SelectItem>
                                    </Select>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose} radius="full">
                                    {t('common.cancel')}
                                </Button>
                                <Button color="primary" type="submit" isLoading={actionLoading} radius="full">
                                    {t('common.save')}
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                placement="center"
                classNames={{
                    base: "rounded-2xl"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {t('users.deleteConfirmTitle')}
                            </ModalHeader>
                            <ModalBody>
                                <p>{t('users.deleteConfirm')}</p>
                                {selectedUser && (
                                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                        <p className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</p>
                                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose} radius="full">
                                    {t('common.cancel')}
                                </Button>
                                <Button color="danger" onPress={handleConfirmDelete} isLoading={actionLoading} radius="full">
                                    {t('common.delete')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
