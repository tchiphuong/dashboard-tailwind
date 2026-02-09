import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Table, TableColumn, TableAction, useTableData } from '@/components/common';
import { JournalEntry, mockJournals, createFetchFn, formatCurrency } from './shared';

export function JournalListPage() {
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
    } = useTableData<JournalEntry>({ fetchFn: createFetchFn(mockJournals), initialPageSize: 10 });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'posted':
                return 'success';
            case 'reversed':
                return 'danger';
            default:
                return 'warning';
        }
    };

    const columns: TableColumn<JournalEntry>[] = useMemo(
        () => [
            {
                key: 'entryNumber',
                label: 'Số bút toán',
                width: 120,
                render: (j) => <span className="font-mono text-blue-600">{j.entryNumber}</span>,
            },
            { key: 'date', label: 'Ngày' },
            { key: 'description', label: 'Diễn giải' },
            { key: 'debitAccount', label: 'TK Nợ' },
            { key: 'creditAccount', label: 'TK Có' },
            {
                key: 'amount',
                label: 'Số tiền',
                render: (j) => <span className="font-semibold">{formatCurrency(j.amount)}</span>,
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (j) => (
                    <Chip size="sm" color={getStatusColor(j.status)} variant="flat">
                        {j.status === 'posted'
                            ? 'Đã ghi sổ'
                            : j.status === 'reversed'
                              ? 'Đã hủy'
                              : 'Nháp'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<JournalEntry>[] = useMemo(
        () => [
            { key: 'view', label: 'Xem', onClick: () => {} },
            {
                key: 'post',
                label: 'Ghi sổ',
                onClick: () => refresh(),
                isVisible: (j) => j.status === 'draft',
            },
            {
                key: 'reverse',
                label: 'Hủy',
                onClick: () => refresh(),
                isVisible: (j) => j.status === 'posted',
            },
        ],
        [refresh]
    );

    return (
        <>
            <PageHeader
                title={t('menu.journalList')}
                breadcrumbs={[{ label: t('menu.group.accounting') }, { label: 'Bút toán' }]}
                actions={
                    <Button
                        color="primary"
                        as="a"
                        href="/accounting/journal/new"
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo bút toán
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(j) => j.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm bút toán..."
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
