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
} from '@heroui/react';
import { ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';

interface PendingRequest {
    id: number;
    requester: {
        name: string;
        email: string;
        avatar: string;
    };
    type: string;
    title: string;
    createdAt: string;
    status: 'pending';
    approver: string;
}

// Mock data
const mockPending: PendingRequest[] = [
    {
        id: 1,
        requester: {
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://i.pravatar.cc/150?u=1',
        },
        type: 'leave',
        title: 'Annual Leave Request',
        createdAt: '2026-01-25',
        status: 'pending',
        approver: 'Manager A',
    },
    {
        id: 2,
        requester: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://i.pravatar.cc/150?u=2',
        },
        type: 'expense',
        title: 'Travel Expense Reimbursement',
        createdAt: '2026-01-24',
        status: 'pending',
        approver: 'Manager B',
    },
];

export function ApprovalsPending() {
    const { t } = useTranslation();
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const loadRequests = useCallback(async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRequests(mockPending);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

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
                    { label: t('menu.pending') },
                ]}
            />

            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t('menu.pending')}
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        {t('approvals.pendingDescription')}
                    </p>
                </div>
                <Button
                    variant="bordered"
                    onPress={loadRequests}
                    isLoading={loading}
                    radius="full"
                    startContent={!loading && <ArrowPathIcon className="h-4 w-4" />}
                >
                    {t('common.refresh')}
                </Button>
            </div>

            <Table
                aria-label="Pending requests table"
                classNames={{
                    wrapper:
                        'rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800',
                    th: 'bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-300 font-semibold',
                }}
                bottomContent={
                    requests.length > 10 && (
                        <div className="flex justify-center p-4">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={Math.ceil(requests.length / 10)}
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
                    <TableColumn>{t('approvals.date')}</TableColumn>
                    <TableColumn>{t('approvals.approver')}</TableColumn>
                    <TableColumn>{t('approvals.status')}</TableColumn>
                </TableHeader>
                <TableBody
                    items={requests}
                    isLoading={loading}
                    loadingContent={
                        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
                    }
                    emptyContent={t('approvals.noPending')}
                >
                    {(request) => (
                        <TableRow key={request.id}>
                            <TableCell>#{request.id}</TableCell>
                            <TableCell>
                                <User
                                    name={request.requester.name}
                                    description={request.requester.email}
                                    avatarProps={{ src: request.requester.avatar, radius: 'full' }}
                                />
                            </TableCell>
                            <TableCell>
                                <Chip color={typeColors[request.type]} size="sm" variant="flat">
                                    {t(`approvals.types.${request.type}`)}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <p className="line-clamp-1 font-medium">{request.title}</p>
                            </TableCell>
                            <TableCell>{request.createdAt}</TableCell>
                            <TableCell>{request.approver}</TableCell>
                            <TableCell>
                                <Chip
                                    color="warning"
                                    size="sm"
                                    variant="flat"
                                    startContent={<ClockIcon className="h-3 w-3" />}
                                >
                                    {t('approvals.statusPending')}
                                </Chip>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
