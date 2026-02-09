import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Avatar } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
    PageHeader,
    Modal as CommonModal,
    Table,
    Input,
    TableColumn,
    TableAction,
    useTableData,
} from '@/components/common';
import { Contact, mockContacts, createFetchFn } from './shared';

export function ContactsPage() {
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
    } = useTableData<Contact>({ fetchFn: createFetchFn(mockContacts), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: TableColumn<Contact>[] = useMemo(
        () => [
            {
                key: 'name',
                label: 'Liên hệ',
                render: (c) => (
                    <div className="flex items-center gap-3">
                        <Avatar src={c.avatar} size="sm" />
                        <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.position}</p>
                        </div>
                    </div>
                ),
            },
            { key: 'company', label: 'Công ty' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'SĐT' },
            { key: 'lastContact', label: 'Liên hệ gần nhất' },
            {
                key: 'tags',
                label: 'Tags',
                render: (c) => (
                    <div className="flex gap-1">
                        {c.tags.map((tag) => (
                            <Chip key={tag} size="sm" variant="flat">
                                {tag}
                            </Chip>
                        ))}
                    </div>
                ),
            },
        ],
        []
    );

    const actions: TableAction<Contact>[] = useMemo(
        () => [
            { key: 'edit', label: 'Sửa', onClick: () => {} },
            { key: 'call', label: 'Gọi', onClick: () => {} },
            { key: 'email', label: 'Email', onClick: () => {} },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.contacts')}
                breadcrumbs={[{ label: t('menu.group.crm') }, { label: t('menu.contacts') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm liên hệ
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(c) => c.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm liên hệ..."
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
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm liên hệ"
            >
                <div className="flex flex-col gap-4">
                    <Input label="Tên" placeholder="Nguyễn Văn A" variant="bordered" radius="lg" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Email" type="email" variant="bordered" radius="lg" />
                        <Input label="SĐT" variant="bordered" radius="lg" />
                    </div>
                    <Input label="Công ty" variant="bordered" radius="lg" />
                    <Input label="Chức vụ" variant="bordered" radius="lg" />
                </div>
            </CommonModal>
        </>
    );
}
