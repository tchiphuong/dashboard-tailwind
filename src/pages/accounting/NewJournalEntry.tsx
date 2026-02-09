import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, Divider, SelectItem } from '@heroui/react';
import { PlusIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { PageHeader, Input, Select } from '@/components/common';
import { mockAccounts, formatCurrency } from './shared';

export function NewJournalEntryPage() {
    const { t } = useTranslation();
    const [lines, setLines] = useState([{ account: '', debit: 0, credit: 0 }]);

    const addLine = () => setLines([...lines, { account: '', debit: 0, credit: 0 }]);
    const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
    const isBalanced = totalDebit === totalCredit && totalDebit > 0;

    return (
        <>
            <PageHeader
                title={t('menu.newEntry')}
                breadcrumbs={[
                    { label: t('menu.group.accounting') },
                    { label: 'Bút toán' },
                    { label: 'Tạo mới' },
                ]}
            />
            <Card className="mx-auto max-w-4xl">
                <CardBody className="space-y-4 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                        <CalculatorIcon className="h-5 w-5" /> Bút toán mới
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="date"
                            label="Ngày ghi sổ"
                            variant="bordered"
                            radius="lg"
                            isRequired
                        />
                        <Input
                            label="Số chứng từ"
                            placeholder="CT001"
                            variant="bordered"
                            radius="lg"
                        />
                    </div>
                    <Input
                        label="Diễn giải"
                        placeholder="Nội dung bút toán..."
                        variant="bordered"
                        radius="lg"
                        isRequired
                    />
                    <Divider />
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Chi tiết bút toán</h4>
                        <Button
                            variant="flat"
                            size="sm"
                            radius="full"
                            onPress={addLine}
                            startContent={<PlusIcon className="h-4 w-4" />}
                        >
                            Thêm dòng
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-500">
                            <div className="col-span-6">Tài khoản</div>
                            <div className="col-span-3 text-right">Nợ</div>
                            <div className="col-span-3 text-right">Có</div>
                        </div>
                        {lines.map((_, i) => (
                            <div key={i} className="grid grid-cols-12 items-center gap-2">
                                <div className="col-span-6">
                                    <Select
                                        placeholder="Chọn tài khoản"
                                        variant="bordered"
                                        size="sm"
                                        radius="lg"
                                    >
                                        {mockAccounts.map((a) => (
                                            <SelectItem key={a.code}>
                                                {a.code} - {a.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        variant="bordered"
                                        size="sm"
                                        radius="lg"
                                        className="text-right"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        variant="bordered"
                                        size="sm"
                                        radius="lg"
                                        className="text-right"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Divider />
                    <div className="grid grid-cols-12 gap-2 font-bold">
                        <div className="col-span-6">Tổng cộng:</div>
                        <div className="col-span-3 text-right text-blue-600">
                            {formatCurrency(totalDebit)}
                        </div>
                        <div className="col-span-3 text-right text-green-600">
                            {formatCurrency(totalCredit)}
                        </div>
                    </div>
                    {!isBalanced && totalDebit > 0 && (
                        <div className="text-sm text-red-500">
                            ⚠️ Bút toán chưa cân: Nợ - Có ={' '}
                            {formatCurrency(totalDebit - totalCredit)}
                        </div>
                    )}
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full" as="a" href="/accounting/journal">
                            Hủy
                        </Button>
                        <Button color="default" variant="flat" radius="full">
                            Lưu nháp
                        </Button>
                        <Button color="primary" radius="full" isDisabled={!isBalanced}>
                            Ghi sổ
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
