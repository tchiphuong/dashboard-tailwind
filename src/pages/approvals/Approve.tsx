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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Textarea,
    useDisclosure,
    Tab,
    Tabs,
    Tooltip,
} from '@heroui/react';
import { ArrowPathIcon, CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { ApprovalTimeline, TimelineStep } from '@/components/approvals/ApprovalTimeline';
import { useDateFormatter } from '@/hooks/useDateFormatter';

interface ApprovalRequest {
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
    status: 'pending' | 'approved' | 'rejected';
    timeline: TimelineStep[];
}

// Mock data
const mockPendingRequests: ApprovalRequest[] = [
    {
        id: 1,
        requester: {
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://i.pravatar.cc/150?u=1',
        },
        type: 'leave',
        title: 'Annual Leave Request',
        description: 'Requesting 5 days leave for family vacation from Jan 15-20.',
        createdAt: '2026-01-25T09:00:00',
        status: 'pending',
        timeline: [
            {
                id: 1,
                title: 'Request Submitted',
                actor: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=1',
                },
                status: 'completed',
                timestamp: '2026-01-25T09:00:00',
                comment: 'Please approve my annual leave.',
            },
            {
                id: 2,
                title: 'Team Leader Approval',
                actor: {
                    name: 'Sarah TeamLead',
                    email: 'sarah@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=20',
                },
                status: 'completed',
                timestamp: '2026-01-25T10:30:00',
                comment: 'Looks good to me.',
            },
            {
                id: 3,
                title: 'Department Manager Approval',
                actor: {
                    name: 'Mike Manager',
                    email: 'mike@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=21',
                },
                status: 'current',
            },
        ],
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
        description: 'Business trip to Hanoi, total expenses $450.',
        createdAt: '2026-01-24T14:00:00',
        status: 'pending',
        timeline: [
            {
                id: 1,
                title: 'Request Submitted',
                actor: {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=2',
                },
                status: 'completed',
                timestamp: '2026-01-24T14:00:00',
            },
            {
                id: 2,
                title: 'Finance Review',
                actor: {
                    name: 'Finance Dept',
                    email: 'finance@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=90',
                },
                status: 'current',
                subSteps: [
                    {
                        id: 21,
                        title: 'Tax Compliance Check',
                        actor: {
                            name: 'Tom Tax',
                            email: 'tom@example.com',
                            avatar: 'https://i.pravatar.cc/150?u=91',
                        },
                        status: 'completed',
                        timestamp: '2026-01-24T16:00:00',
                        comment: 'Tax calculation is correct.',
                    },
                    {
                        id: 22,
                        title: 'Budget Approval',
                        actor: {
                            name: 'Ben Budget',
                            email: 'ben@example.com',
                            avatar: 'https://i.pravatar.cc/150?u=92',
                        },
                        status: 'current',
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        requester: {
            name: 'Bob Wilson',
            email: 'bob@example.com',
            avatar: 'https://i.pravatar.cc/150?u=3',
        },
        type: 'purchase',
        title: 'New Laptop Purchase',
        description: 'Request to purchase MacBook Pro for development work.',
        createdAt: '2026-01-23T08:00:00',
        status: 'pending',
        timeline: [
            {
                id: 1,
                title: 'Request Submitted',
                actor: {
                    name: 'Bob Wilson',
                    email: 'bob@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=3',
                },
                status: 'completed',
                timestamp: '2026-01-23T08:00:00',
            },
            {
                id: 2,
                title: 'IT Asset Manager',
                actor: {
                    name: 'Ian IT',
                    email: 'ian@example.com',
                    avatar: 'https://i.pravatar.cc/150?u=23',
                },
                status: 'current',
            },
        ],
    },
];

export function ApprovalsApprove() {
    const { t } = useTranslation();
    const { formatDate } = useDateFormatter();
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
    const [comment, setComment] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'view'>('view');

    const loadRequests = useCallback(async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRequests(mockPendingRequests);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    const handleAction = (request: ApprovalRequest, action: 'approve' | 'reject' | 'view') => {
        setSelectedRequest(request);
        setActionType(action);
        setComment('');
        onOpen();
    };

    const handleConfirmAction = async () => {
        if (!selectedRequest) return;
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Remove from pending list
        setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
        onClose();
        setLoading(false);
    };

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
                    { label: t('menu.approve') },
                ]}
            />

            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t('menu.approve')}
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        {t('approvals.approveDescription')}
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
                aria-label="Approval requests table"
                classNames={{
                    wrapper:
                        'rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
                    th: 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-semibold',
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
                    <TableColumn>{t('approvals.actions')}</TableColumn>
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
                            <TableCell>{formatDate(request.createdAt)}</TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    <Tooltip content={t('approvals.viewRequest')}>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            radius="full"
                                            onPress={() => handleAction(request, 'view')}
                                        >
                                            <EyeIcon className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content={t('menu.approve')} color="success">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="success"
                                            radius="full"
                                            onPress={() => handleAction(request, 'approve')}
                                        >
                                            <CheckIcon className="text-success-600 dark:text-success-400 h-4 w-4" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content={t('approvals.reject')} color="danger">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            radius="full"
                                            onPress={() => handleAction(request, 'reject')}
                                        >
                                            <XMarkIcon className="text-danger-600 dark:text-danger-400 h-4 w-4" />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Action Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader>
                        {actionType === 'view'
                            ? t('approvals.viewRequest')
                            : actionType === 'approve'
                              ? t('approvals.confirmApprove')
                              : t('approvals.confirmReject')}
                    </ModalHeader>
                    <ModalBody>
                        {selectedRequest && (
                            <div className="flex flex-col gap-6">
                                {/* Detail Header */}
                                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                {selectedRequest.title}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-2">
                                                <Chip
                                                    color={typeColors[selectedRequest.type]}
                                                    size="sm"
                                                    variant="flat"
                                                >
                                                    {t(`approvals.types.${selectedRequest.type}`)}
                                                </Chip>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    #{selectedRequest.id} •{' '}
                                                    {formatDate(selectedRequest.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <User
                                            name={selectedRequest.requester.name}
                                            description={selectedRequest.requester.email}
                                            avatarProps={{
                                                src: selectedRequest.requester.avatar,
                                                radius: 'full',
                                            }}
                                        />
                                    </div>
                                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                                        {selectedRequest.description}
                                    </p>
                                </div>

                                {/* Timeline Visualization */}
                                <div>
                                    <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
                                        Approval Timeline
                                    </h4>
                                    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                                        <ApprovalTimeline steps={selectedRequest.timeline} />
                                    </div>
                                </div>

                                {actionType !== 'view' && (
                                    <Textarea
                                        label={t('approvals.comment')}
                                        labelPlacement="outside"
                                        placeholder={t('approvals.commentPlaceholder')}
                                        value={comment}
                                        onValueChange={setComment}
                                        minRows={3}
                                    />
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="bordered" onPress={onClose} radius="full">
                            {t('common.cancel')}
                        </Button>
                        {actionType !== 'view' && (
                            <Button
                                color={actionType === 'approve' ? 'success' : 'danger'}
                                onPress={handleConfirmAction}
                                isLoading={loading}
                                radius="full"
                            >
                                {actionType === 'approve'
                                    ? t('menu.approve')
                                    : t('approvals.reject')}
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
