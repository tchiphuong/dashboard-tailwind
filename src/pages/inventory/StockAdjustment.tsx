import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, Divider, SelectItem } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Select, Input } from '@/components/common';
import { mockWarehouses } from './shared';

export function StockAdjustmentPage() {
    const { t } = useTranslation();
    const [adjustments, setAdjustments] = useState<
        { sku: string; name: string; current: number; adjust: number; reason: string }[]
    >([]);

    const addAdjustment = () =>
        setAdjustments([...adjustments, { sku: '', name: '', current: 0, adjust: 0, reason: '' }]);

    return (
        <>
            <PageHeader
                title={t('menu.stockAdjustment')}
                breadcrumbs={[
                    { label: t('menu.group.inventory') },
                    { label: t('menu.stock') },
                    { label: 'Điều chỉnh' },
                ]}
            />
            <Card className="mx-auto max-w-4xl">
                <CardBody className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Phiếu điều chỉnh tồn kho</h3>
                        <Button
                            color="primary"
                            variant="flat"
                            size="sm"
                            radius="full"
                            onPress={addAdjustment}
                            startContent={<PlusIcon className="h-4 w-4" />}
                        >
                            Thêm dòng
                        </Button>
                    </div>
                    <Select label="Kho" placeholder="Chọn kho" variant="bordered" radius="lg">
                        {mockWarehouses.map((w) => (
                            <SelectItem key={w.id}>{w.name}</SelectItem>
                        ))}
                    </Select>
                    <Select label="Loại điều chỉnh" variant="bordered" radius="lg">
                        <SelectItem key="increase">Tăng tồn kho</SelectItem>
                        <SelectItem key="decrease">Giảm tồn kho</SelectItem>
                        <SelectItem key="damage">Hàng hỏng</SelectItem>
                        <SelectItem key="inventory">Kiểm kê</SelectItem>
                    </Select>
                    <Divider />
                    {adjustments.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            Nhấn "Thêm dòng" để bắt đầu điều chỉnh
                        </div>
                    ) : (
                        adjustments.map((_, i) => (
                            <div key={i} className="grid grid-cols-12 items-end gap-3">
                                <div className="col-span-3">
                                    <Input
                                        label="SKU"
                                        placeholder="SKU..."
                                        variant="bordered"
                                        radius="lg"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <Input
                                        label="Tên SP"
                                        placeholder="Tên sản phẩm"
                                        variant="bordered"
                                        radius="lg"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        label="Số lượng"
                                        placeholder="0"
                                        variant="bordered"
                                        radius="lg"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        label="Ghi chú"
                                        placeholder="Lý do..."
                                        variant="bordered"
                                        radius="lg"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                    <Divider />
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full">
                            Hủy
                        </Button>
                        <Button color="primary" radius="full">
                            Lưu điều chỉnh
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
