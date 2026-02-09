import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, Divider, SelectItem } from '@heroui/react';
import { UserPlusIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { PageHeader, Select, Input } from '@/components/common';

export function AddLeadPage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('menu.addLead')}
                breadcrumbs={[
                    { label: t('menu.group.crm') },
                    { label: t('menu.leads') },
                    { label: 'Thêm mới' },
                ]}
            />
            <Card className="mx-auto max-w-2xl">
                <CardBody className="space-y-4 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                        <UserPlusIcon className="h-5 w-5" /> Thông tin Lead
                    </h3>
                    <Input
                        label="Tên khách hàng"
                        placeholder="Nguyễn Văn A"
                        variant="bordered"
                        radius="lg"
                        isRequired
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="email@example.com"
                            variant="bordered"
                            radius="lg"
                            startContent={<EnvelopeIcon className="h-4 w-4 text-gray-400" />}
                        />
                        <Input
                            label="Số điện thoại"
                            placeholder="0901234567"
                            variant="bordered"
                            radius="lg"
                            startContent={<PhoneIcon className="h-4 w-4 text-gray-400" />}
                        />
                    </div>
                    <Input
                        label="Công ty"
                        placeholder="Tên công ty"
                        variant="bordered"
                        radius="lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Nguồn" variant="bordered" radius="lg">
                            <SelectItem key="website">Website</SelectItem>
                            <SelectItem key="referral">Giới thiệu</SelectItem>
                            <SelectItem key="ads">Quảng cáo</SelectItem>
                            <SelectItem key="social">Mạng xã hội</SelectItem>
                            <SelectItem key="cold_call">Cold Call</SelectItem>
                        </Select>
                        <Input
                            type="number"
                            label="Giá trị ước tính (VNĐ)"
                            placeholder="10000000"
                            variant="bordered"
                            radius="lg"
                        />
                    </div>
                    <Select label="Người phụ trách" variant="bordered" radius="lg">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <SelectItem key={i}>Sales {i}</SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="Ghi chú"
                        placeholder="Ghi chú thêm..."
                        variant="bordered"
                        radius="lg"
                    />
                    <Divider />
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full" as="a" href="/crm/leads">
                            Hủy
                        </Button>
                        <Button color="primary" radius="full">
                            Lưu Lead
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
