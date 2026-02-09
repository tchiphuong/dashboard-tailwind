import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Card, CardBody, Divider, Progress } from '@heroui/react';
import { PlusIcon, BuildingStorefrontIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { PageHeader, Modal as CommonModal, Input } from '@/components/common';
import { mockWarehouses } from './shared';

export function WarehousesPage() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <PageHeader
                title={t('menu.warehouses')}
                breadcrumbs={[
                    { label: t('menu.group.inventory') },
                    { label: t('menu.warehouses') },
                ]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm kho
                    </Button>
                }
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockWarehouses.map((wh) => (
                    <Card
                        key={wh.id}
                        className={`shadow-lg ${wh.status === 'inactive' ? 'opacity-60' : ''}`}
                    >
                        <CardBody className="p-6">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">{wh.name}</h3>
                                    <p className="text-sm text-gray-500">{wh.code}</p>
                                </div>
                                <Chip
                                    size="sm"
                                    color={wh.status === 'active' ? 'success' : 'default'}
                                    variant="flat"
                                >
                                    {wh.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                                </Chip>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <BuildingStorefrontIcon className="mr-2 inline h-4 w-4" />
                                    {wh.address}
                                </p>
                                <p>
                                    <UserGroupIcon className="mr-2 inline h-4 w-4" />
                                    Quản lý: {wh.manager}
                                </p>
                            </div>
                            <Divider className="my-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Sức chứa:</span>
                                    <span>
                                        {wh.used.toLocaleString()} / {wh.capacity.toLocaleString()}
                                    </span>
                                </div>
                                <Progress
                                    value={(wh.used / wh.capacity) * 100}
                                    color={
                                        wh.used / wh.capacity > 0.9
                                            ? 'danger'
                                            : wh.used / wh.capacity > 0.7
                                              ? 'warning'
                                              : 'success'
                                    }
                                />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="flat" radius="full" className="flex-1">
                                    Xem chi tiết
                                </Button>
                                <Button size="sm" variant="bordered" radius="full">
                                    Sửa
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm kho mới"
            >
                <div className="flex flex-col gap-4">
                    <Input label="Mã kho" placeholder="WH-XXX" variant="bordered" radius="lg" />
                    <Input label="Tên kho" placeholder="Kho ABC" variant="bordered" radius="lg" />
                    <Input
                        label="Địa chỉ"
                        placeholder="Địa chỉ đầy đủ"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Người quản lý"
                        placeholder="Tên người quản lý"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        type="number"
                        label="Sức chứa"
                        placeholder="10000"
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}
