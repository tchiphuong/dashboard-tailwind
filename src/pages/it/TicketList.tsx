import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Table, TableColumn, TableAction, useTableData } from '@/components/common';
import { SupportTicket, mockTickets, createFetchFn } from './shared';

export function TicketListPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<SupportTicket>({ fetchFn: createFetchFn(mockTickets), initialPageSize: 10 });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
            case 'closed':
                return 'success';
            case 'inprogress':
                return 'primary';
            case 'pending':
                return 'warning';
            default:
                return 'danger';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'danger';
            case 'high':
                return 'warning';
            case 'medium':
                return 'primary';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<SupportTicket>[] = useMemo(
        () => [
            {
                key: 'ticketNumber',
                label: 'Mã phiếu',
                width: 110,
                render: (tk) => <span className="font-mono text-blue-600">{tk.ticketNumber}</span>,
            },
            { key: 'subject', label: 'Tiêu đề' },
            {
                key: 'category',
                label: 'Loại',
                render: (tk) => (
                    <Chip size="sm" variant="flat">
                        {tk.category === 'hardware'
                            ? 'Phần cứng'
                            : tk.category === 'software'
                              ? 'Phần mềm'
                              : tk.category === 'network'
                                ? 'Mạng'
                                : tk.category === 'access'
                                  ? 'Truy cập'
                                  : 'Khác'}
                    </Chip>
                ),
            },
            {
                key: 'priority',
                label: 'Ưu tiên',
                render: (tk) => (
                    <Chip size="sm" color={getPriorityColor(tk.priority)} variant="flat">
                        {tk.priority === 'urgent'
                            ? 'Khẩn cấp'
                            : tk.priority === 'high'
                              ? 'Cao'
                              : tk.priority === 'medium'
                                ? 'Trung bình'
                                : 'Thấp'}
                    </Chip>
                ),
            },
            { key: 'requester', label: 'Người yêu cầu' },
            {
                key: 'assignedTo',
                label: 'Người xử lý',
                render: (tk) => tk.assignedTo || <span className="text-gray-400">Chưa gán</span>,
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (tk) => (
                    <Chip size="sm" color={getStatusColor(tk.status)} variant="flat">
                        {tk.status === 'open'
                            ? 'Mở'
                            : tk.status === 'inprogress'
                              ? 'Đang xử lý'
                              : tk.status === 'pending'
                                ? 'Chờ'
                                : tk.status === 'resolved'
                                  ? 'Đã xử lý'
                                  : 'Đóng'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<SupportTicket>[] = useMemo(
        () => [
            { key: 'view', label: 'Xem', onClick: () => {} },
            {
                key: 'assign',
                label: 'Gán',
                onClick: () => refresh(),
                isVisible: (tk) => !tk.assignedTo,
            },
            {
                key: 'resolve',
                label: 'Hoàn thành',
                onClick: () => refresh(),
                isVisible: (tk) => tk.status === 'inprogress',
            },
        ],
        [refresh]
    );

    return (
        <>
            <PageHeader
                title={t('menu.ticketList')}
                breadcrumbs={[{ label: t('menu.group.it') }, { label: 'Phiếu hỗ trợ' }]}
                actions={
                    <Button
                        color="primary"
                        as="a"
                        href="/it/tickets/new"
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo phiếu
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(tk) => tk.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm phiếu..."
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
        </>
    );
}
