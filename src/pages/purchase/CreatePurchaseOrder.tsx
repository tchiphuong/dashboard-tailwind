import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, Divider, SelectItem } from '@heroui/react';
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { PageHeader, Select, Input } from '@/components/common';
import { mockSuppliers, mockWarehouses, formatCurrency } from './shared';

export function CreatePurchaseOrderPage() {
    const { t } = useTranslation();
    const [poItems, setPoItems] = useState<
        { sku: string; name: string; qty: number; price: number }[]
    >([{ sku: '', name: '', qty: 1, price: 0 }]);

    const addItem = () => setPoItems([...poItems, { sku: '', name: '', qty: 1, price: 0 }]);
    const totalAmount = poItems.reduce((sum, item) => sum + item.qty * item.price, 0);

    return (
        <>
            <PageHeader
                title={t('menu.createPO')}
                breadcrumbs={[
                    { label: t('menu.group.purchase') },
                    { label: t('menu.purchaseOrders') },
                    { label: 'Tạo mới' },
                ]}
            />
            <Card className="mx-auto max-w-4xl">
                <CardBody className="space-y-4 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                        <ClipboardDocumentListIcon className="h-5 w-5" /> Thông tin đơn mua hàng
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Nhà cung cấp" variant="bordered" radius="lg" isRequired>
                            {mockSuppliers.map((s) => (
                                <SelectItem key={s.id}>{s.name}</SelectItem>
                            ))}
                        </Select>
                        <Select label="Kho nhận" variant="bordered" radius="lg">
                            {mockWarehouses.map((w) => (
                                <SelectItem key={w.id}>{w.name}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Input type="date" label="Ngày dự kiến nhận" variant="bordered" radius="lg" />
                    <Divider />
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Danh sách sản phẩm</h4>
                        <Button
                            variant="flat"
                            size="sm"
                            radius="full"
                            onPress={addItem}
                            startContent={<PlusIcon className="h-4 w-4" />}
                        >
                            Thêm SP
                        </Button>
                    </div>
                    {poItems.map((item, i) => (
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
                                    label="SL"
                                    value={String(item.qty)}
                                    variant="bordered"
                                    radius="lg"
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    label="Đơn giá"
                                    placeholder="0"
                                    variant="bordered"
                                    radius="lg"
                                />
                            </div>
                        </div>
                    ))}
                    <Divider />
                    <div className="flex items-center justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-green-600">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full" as="a" href="/purchase/orders">
                            Hủy
                        </Button>
                        <Button color="default" variant="flat" radius="full">
                            Lưu nháp
                        </Button>
                        <Button color="primary" radius="full">
                            Gửi đơn hàng
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
