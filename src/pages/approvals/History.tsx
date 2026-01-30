import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
    User,
    Pagination,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tooltip,
} from '@heroui/react';
import {
    ArrowPathIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { ApprovalTimeline, TimelineStep } from '@/components/approvals/ApprovalTimeline';
import { useDateFormatter } from '@/hooks/useDateFormatter';

interface HistoryItem {
    id: number;
    requester: {
        name: string;
        email: string;
        avatar: string;
    };
    type: string;
    title: string;
    description: string;
    createdAt: string;
    processedAt: string;
    status: 'approved' | 'rejected';
    approver: string;
    timeline: TimelineStep[];
}

// Mock data
const mockHistory: HistoryItem[] = [
    {
        id: 101,
        requester: {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            avatar: 'https://i.pravatar.cc/150?u=10',
        },
        type: 'leave',
        title: 'Sick Leave',
        description: 'Feeling unfit for work due to fever.',
        createdAt: '2026-01-20T08:00:00',
        processedAt: '2026-01-21T09:00:00',
        status: 'approved',
        approver: 'Manager A',
        timeline: [
            {
                id: 1,
                title: 'Variable Application',
                actor: {
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=10',
                },
                status: 'completed',
                timestamp: '2026-01-20T08:30:00',
            },
            {
                id: 2,
                title: 'Manager Approval',
                actor: {
                    name: 'Manager A',
                    email: 'manager.a@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=99',
                },
                status: 'completed',
                timestamp: '2026-01-21T09:00:00',
                comment: 'Get well soon.',
            },
        ],
    },
    {
        id: 102,
        requester: {
            name: 'Bob Brown',
            email: 'bob@example.com',
            avatar: 'https://i.pravatar.cc/150?u=11',
        },
        type: 'expense',
        title: 'Conference Fee',
        description: 'Fee for the annual tech conference.',
        createdAt: '2026-01-18T14:00:00',
        processedAt: '2026-01-19T10:00:00',
        status: 'rejected',
        approver: 'Manager B',
        timeline: [
            {
                id: 1,
                title: 'Expense Submitted',
                actor: {
                    name: 'Bob Brown',
                    email: 'bob@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=11',
                },
                status: 'completed',
                timestamp: '2026-01-18T14:00:00',
            },
            {
                id: 2,
                title: 'Verification Process',
                actor: {
                    name: 'Operations',
                    email: 'ops@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=80',
                },
                status: 'rejected',
                timestamp: '2026-01-19T10:00:00',
                subSteps: [
                    {
                        id: 21,
                        title: 'Receipt Check',
                        actor: {
                            name: 'Rachel Receipt',
                            email: 'rachel@example.com',
                            avatar: 'https://i.pravatar.cc/150?u=81',
                        },
                        status: 'completed',
                        timestamp: '2026-01-19T09:00:00',
                    },
                    {
                        id: 22,
                        title: 'Policy Check',
                        actor: {
                            name: 'Manager B',
                            email: 'manager.b@example.com',
                            avatar: 'https://i.pravatar.cc/150?u=98',
                        },
                        status: 'rejected',
                        timestamp: '2026-01-19T10:00:00',
                        comment: 'Not in budget plan.',
                    },
                ],
            },
        ],
    },
    {
        id: 103,
        requester: {
            name: 'Carol White',
            email: 'carol@example.com',
            avatar: 'https://i.pravatar.cc/150?u=12',
        },
        type: 'purchase',
        title: 'Office Supplies',
        description: 'Ordering new stationery for the team.',
        createdAt: '2026-01-15T11:00:00',
        processedAt: '2026-01-16T09:30:00',
        status: 'approved',
        approver: 'Manager A',
        timeline: [
            {
                id: 1,
                title: 'Purchase Request',
                actor: {
                    name: 'Carol White',
                    email: 'carol@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=12',
                },
                status: 'completed',
                timestamp: '2026-01-15T11:00:00',
            },
            {
                id: 2,
                title: 'Approved',
                actor: {
                    name: 'Manager A',
                    email: 'manager.a@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=99',
                },
                status: 'completed',
                timestamp: '2026-01-16T09:30:00',
            },
        ],
    },
    {
        id: 104,
        requester: {
            name: 'David Lee',
            email: 'david@example.com',
            avatar: 'https://i.pravatar.cc/150?u=13',
        },
        type: 'travel',
        title: 'Business Trip to Singapore',
        description: 'Meeting with regional partners.',
        createdAt: '2026-01-10T09:00:00',
        processedAt: '2026-01-12T15:00:00',
        status: 'approved',
        approver: 'Director',
        timeline: [
            {
                id: 1,
                title: 'Travel Request',
                actor: {
                    name: 'David Lee',
                    email: 'david@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=13',
                },
                status: 'completed',
                timestamp: '2026-01-10T09:00:00',
            },
            {
                id: 2,
                title: 'Director Approval',
                actor: {
                    name: 'Director',
                    email: 'director@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=97',
                },
                status: 'completed',
                timestamp: '2026-01-12T15:00:00',
                comment: 'Approved. Have a safe trip.',
            },
        ],
    },
];

export function ApprovalsHistory() {
    const { t } = useTranslation();
    const { formatDate } = useDateFormatter();
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const loadHistory = useCallback(async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setItems(mockHistory);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleViewDetails = (item: HistoryItem) => {
        setSelectedItem(item);
        onOpen();
    };

    const filteredItems = items.filter(
        (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.requester.name.toLowerCase().includes(search.toLowerCase())
    );

    const typeColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
        leave: 'primary',
        expense: 'warning',
        purchase: 'secondary',
        travel: 'success',
        overtime: 'danger',
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('menu.approvals'), href: '/approvals/pending' },
                    { label: t('menu.history') },
                ]}
            />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t('menu.history')}
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        {t('approvals.historyDescription')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder={t('common.search') + '...'}
                        value={search}
                        onValueChange={setSearch}
                        startContent={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                        className="w-64"
                        radius="full"
                    />
                    <Button
                        variant="bordered"
                        onPress={loadHistory}
                        isLoading={loading}
                        radius="full"
                        isIconOnly
                    >
                        <ArrowPathIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Table
                aria-label="Approval history table"
                classNames={{
                    wrapper:
                        'rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800',
                    th: 'bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-300 font-semibold',
                }}
                bottomContent={
                    filteredItems.length > 10 && (
                        <div className="flex justify-center p-4">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={Math.ceil(filteredItems.length / 10)}
                                onChange={setPage}
                                radius="full"
                            />
                        </div>
                    )
                }
            >
                <TableHeader>
                    <TableColumn width={60}>ID</TableColumn>
                    <TableColumn>{t('approvals.requester')}</TableColumn>
                    <TableColumn>{t('approvals.type')}</TableColumn>
                    <TableColumn>{t('approvals.title')}</TableColumn>
                    <TableColumn>{t('approvals.processedAt')}</TableColumn>
                    <TableColumn>{t('approvals.approver')}</TableColumn>
                    <TableColumn>{t('approvals.status')}</TableColumn>
                    <TableColumn children={undefined}></TableColumn>
                </TableHeader>
                <TableBody
                    items={filteredItems}
                    isLoading={loading}
                    loadingContent={
                        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
                    }
                    emptyContent={t('approvals.noHistory')}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>#{item.id}</TableCell>
                            <TableCell>
                                <User
                                    name={item.requester.name}
                                    description={item.requester.email}
                                    avatarProps={{ src: item.requester.avatar, radius: 'full' }}
                                />
                            </TableCell>
                            <TableCell>
                                <Chip color={typeColors[item.type]} size="sm" variant="flat">
                                    {t(`approvals.types.${item.type}`)}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <p className="line-clamp-1 font-medium">{item.title}</p>
                            </TableCell>
                            <TableCell>{formatDate(item.processedAt)}</TableCell>
                            <TableCell>{item.approver}</TableCell>
                            <TableCell>
                                <Chip
                                    color={item.status === 'approved' ? 'success' : 'danger'}
                                    size="sm"
                                    variant="flat"
                                    startContent={
                                        item.status === 'approved' ? (
                                            <CheckCircleIcon className="h-3 w-3" />
                                        ) : (
                                            <XCircleIcon className="h-3 w-3" />
                                        )
                                    }
                                >
                                    {item.status === 'approved'
                                        ? t('approvals.statusApproved')
                                        : t('approvals.statusRejected')}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <Tooltip content={t('approvals.viewRequest')}>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        radius="full"
                                        onPress={() => handleViewDetails(item)}
                                    >
                                        <EyeIcon className="h-4 w-4 text-gray-500" />
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Details Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader>{t('approvals.viewRequest')}</ModalHeader>
                    <ModalBody>
                        {selectedItem && (
                            <div className="flex flex-col gap-6">
                                {/* Detail Header */}
                                <div className="rounded-xl bg-gray-50 p-4 dark:bg-zinc-700/50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                {selectedItem.title}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-2">
                                                <Chip
                                                    color={typeColors[selectedItem.type]}
                                                    size="sm"
                                                    variant="flat"
                                                >
                                                    {t(`approvals.types.${selectedItem.type}`)}
                                                </Chip>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    #{selectedItem.id} •{' '}
                                                    {formatDate(selectedItem.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <User
                                            name={selectedItem.requester.name}
                                            description={selectedItem.requester.email}
                                            avatarProps={{
                                                src: selectedItem.requester.avatar,
                                                radius: 'full',
                                            }}
                                        />
                                    </div>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        {selectedItem.description}
                                    </p>
                                </div>

                                {/* Timeline Visualization */}
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
                                        Approval Timeline
                                    </h4>
                                    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
                                        <ApprovalTimeline steps={selectedItem.timeline} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="bordered" onPress={onClose} radius="full">
                            {t('common.close')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
