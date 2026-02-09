import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Table, TableColumn, useTableData } from '@/components/common';
import { DigitalSignature, mockSignatures, createFetchFn } from './shared';

export function SignaturesPage() {
    const { t } = useTranslation();
    const { items, isLoading, total, page, pageSize, setPage, setPageSize, refresh } =
        useTableData<DigitalSignature>({
            fetchFn: createFetchFn(mockSignatures),
            initialPageSize: 10,
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'expired':
                return 'danger';
            case 'partial':
                return 'warning';
            default:
                return 'primary';
        }
    };

    const columns: TableColumn<DigitalSignature>[] = useMemo(
        () => [
            { key: 'documentName', label: 'Tài liệu' },
            { key: 'requester', label: 'Người yêu cầu' },
            { key: 'signers', label: 'Người ký', render: (s) => s.signers.join(', ') },
            {
                key: 'createdAt',
                label: 'Ngày tạo',
                render: (s) => new Date(s.createdAt).toLocaleDateString('vi-VN'),
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (s) => (
                    <Chip size="sm" color={getStatusColor(s.status)} variant="flat">
                        {s.status === 'pending'
                            ? 'Chờ ký'
                            : s.status === 'partial'
                              ? 'Đã ký một phần'
                              : s.status === 'completed'
                                ? 'Hoàn thành'
                                : 'Hết hạn'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.signatures')}
                breadcrumbs={[{ label: t('menu.group.documents') }, { label: 'Chữ ký số' }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Yêu cầu ký
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(s) => s.id}
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
                maxHeight="500px"
            />
        </>
    );
}
