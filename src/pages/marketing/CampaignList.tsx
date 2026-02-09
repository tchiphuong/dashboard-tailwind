import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Table, TableColumn, useTableData } from '@/components/common';
import { Campaign, mockCampaigns, createFetchFn, formatCurrency } from './shared';

export function CampaignListPage() {
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
    } = useTableData<Campaign>({ fetchFn: createFetchFn(mockCampaigns), initialPageSize: 10 });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'completed':
                return 'primary';
            case 'paused':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'email':
                return 'Email';
            case 'social':
                return 'MXH';
            case 'ads':
                return 'Quảng cáo';
            case 'event':
                return 'Sự kiện';
            default:
                return 'Nội dung';
        }
    };

    const columns: TableColumn<Campaign>[] = useMemo(
        () => [
            { key: 'name', label: 'Chiến dịch' },
            {
                key: 'type',
                label: 'Loại',
                render: (c) => (
                    <Chip size="sm" variant="flat">
                        {getTypeLabel(c.type)}
                    </Chip>
                ),
            },
            { key: 'budget', label: 'Ngân sách', render: (c) => formatCurrency(c.budget) },
            {
                key: 'spent',
                label: 'Đã chi',
                render: (c) => <span className="text-red-500">{formatCurrency(c.spent)}</span>,
            },
            { key: 'leads', label: 'Leads' },
            { key: 'conversions', label: 'Chuyển đổi' },
            { key: 'startDate', label: 'Bắt đầu' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (c) => (
                    <Chip size="sm" color={getStatusColor(c.status)} variant="flat">
                        {c.status === 'active'
                            ? 'Đang chạy'
                            : c.status === 'completed'
                              ? 'Hoàn thành'
                              : c.status === 'paused'
                                ? 'Tạm dừng'
                                : 'Nháp'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.campaignList')}
                breadcrumbs={[{ label: t('menu.group.marketing') }, { label: t('menu.campaigns') }]}
                actions={
                    <Button
                        color="primary"
                        as="a"
                        href="/marketing/campaigns/new"
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo chiến dịch
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(c) => c.id}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm chiến dịch..."
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
