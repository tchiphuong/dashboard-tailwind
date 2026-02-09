import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, SelectItem } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Modal as CommonModal, Input, Select } from '@/components/common';
import { mockAccounts, formatCurrency } from './shared';

export function ChartOfAccountsPage() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const accountTypes = [
        { key: 'asset', label: 'Tài sản', color: 'text-blue-600' },
        { key: 'liability', label: 'Nợ phải trả', color: 'text-red-600' },
        { key: 'equity', label: 'Vốn chủ sở hữu', color: 'text-purple-600' },
        { key: 'revenue', label: 'Doanh thu', color: 'text-green-600' },
        { key: 'expense', label: 'Chi phí', color: 'text-orange-600' },
    ];

    return (
        <>
            <PageHeader
                title={t('menu.chartOfAccounts')}
                breadcrumbs={[
                    { label: t('menu.group.accounting') },
                    { label: 'Hệ thống tài khoản' },
                ]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm TK
                    </Button>
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {accountTypes.map((type) => (
                    <Card key={type.key}>
                        <CardBody className="p-4">
                            <h3 className={`mb-4 text-lg font-bold ${type.color}`}>{type.label}</h3>
                            <div className="space-y-2">
                                {mockAccounts
                                    .filter((a) => a.type === type.key)
                                    .map((account) => (
                                        <div
                                            key={account.id}
                                            className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                                        >
                                            <div>
                                                <span className="mr-2 font-mono text-blue-600">
                                                    {account.code}
                                                </span>
                                                <span>{account.name}</span>
                                            </div>
                                            <span
                                                className={`font-semibold ${account.type === 'expense' || account.type === 'asset' ? 'text-blue-600' : 'text-green-600'}`}
                                            >
                                                {formatCurrency(account.balance)}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm tài khoản"
            >
                <div className="flex flex-col gap-4">
                    <Input label="Mã tài khoản" placeholder="111" variant="bordered" radius="lg" />
                    <Input
                        label="Tên tài khoản"
                        placeholder="Tiền mặt"
                        variant="bordered"
                        radius="lg"
                    />
                    <Select label="Loại tài khoản" variant="bordered" radius="lg">
                        {accountTypes.map((t) => (
                            <SelectItem key={t.key}>{t.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Tài khoản cha"
                        variant="bordered"
                        radius="lg"
                        placeholder="Chọn tài khoản cha"
                    >
                        {mockAccounts.map((a) => (
                            <SelectItem key={a.code}>
                                {a.code} - {a.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </CommonModal>
        </>
    );
}
