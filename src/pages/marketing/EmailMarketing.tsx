import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Card, CardBody, SelectItem } from '@heroui/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import {
    PageHeader,
    Modal as CommonModal,
    Table,
    Input,
    Select,
    TableColumn,
    useTableData,
} from '@/components/common';
import { EmailCampaign, mockEmailCampaigns, createFetchFn } from './shared';

export function EmailMarketingPage() {
    const { t } = useTranslation();
    const { items, isLoading, total, page, pageSize, setPage, setPageSize, refresh } =
        useTableData<EmailCampaign>({
            fetchFn: createFetchFn(mockEmailCampaigns),
            initialPageSize: 10,
        });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent':
                return 'success';
            case 'sending':
                return 'primary';
            case 'scheduled':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<EmailCampaign>[] = useMemo(
        () => [
            { key: 'name', label: 'Chiến dịch' },
            { key: 'subject', label: 'Tiêu đề' },
            { key: 'recipients', label: 'Người nhận' },
            { key: 'sent', label: 'Đã gửi' },
            {
                key: 'opened',
                label: 'Mở',
                render: (e) => (
                    <span className="text-blue-600">
                        {e.opened} ({Math.round((e.opened / e.sent) * 100)}%)
                    </span>
                ),
            },
            {
                key: 'clicked',
                label: 'Click',
                render: (e) => (
                    <span className="text-green-600">
                        {e.clicked} ({Math.round((e.clicked / e.sent) * 100)}%)
                    </span>
                ),
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (e) => (
                    <Chip size="sm" color={getStatusColor(e.status)} variant="flat">
                        {e.status === 'sent'
                            ? 'Đã gửi'
                            : e.status === 'sending'
                              ? 'Đang gửi'
                              : e.status === 'scheduled'
                                ? 'Lên lịch'
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
                title={t('menu.emailMarketing')}
                breadcrumbs={[{ label: t('menu.group.marketing') }, { label: 'Email Marketing' }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PaperAirplaneIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo email
                    </Button>
                }
            />
            {/* Stats */}
            <div className="mb-6 grid grid-cols-4 gap-4">
                <Card>
                    <CardBody className="p-4 text-center">
                        <p className="text-2xl font-bold">
                            {mockEmailCampaigns
                                .reduce((s, e) => s + e.recipients, 0)
                                .toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Tổng người nhận</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {mockEmailCampaigns.reduce((s, e) => s + e.opened, 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Đã mở</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {mockEmailCampaigns.reduce((s, e) => s + e.clicked, 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Đã click</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {Math.round(
                                (mockEmailCampaigns.reduce((s, e) => s + e.clicked, 0) /
                                    mockEmailCampaigns.reduce((s, e) => s + e.sent, 0)) *
                                    100
                            )}
                            %
                        </p>
                        <p className="text-sm text-gray-500">Tỷ lệ click</p>
                    </CardBody>
                </Card>
            </div>
            <Table
                items={items}
                columns={columns}
                getRowKey={(e) => e.id}
                isLoading={isLoading}
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
                maxHeight="400px"
            />
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tạo email mới"
            >
                <div className="flex flex-col gap-4">
                    <Input label="Tên chiến dịch" variant="bordered" radius="lg" />
                    <Input label="Tiêu đề email" variant="bordered" radius="lg" />
                    <Select label="Danh sách người nhận" variant="bordered" radius="lg">
                        <SelectItem key="all">Tất cả khách hàng</SelectItem>
                        <SelectItem key="leads">Leads mới</SelectItem>
                        <SelectItem key="customers">Khách hàng hiện tại</SelectItem>
                    </Select>
                </div>
            </CommonModal>
        </>
    );
}
