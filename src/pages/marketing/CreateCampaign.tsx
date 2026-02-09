import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, Divider, SelectItem } from '@heroui/react';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import { PageHeader, Select, Input } from '@/components/common';

export function CreateCampaignPage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('menu.createCampaign')}
                breadcrumbs={[
                    { label: t('menu.group.marketing') },
                    { label: t('menu.campaigns') },
                    { label: 'Tạo mới' },
                ]}
            />
            <Card className="mx-auto max-w-2xl">
                <CardBody className="space-y-4 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                        <MegaphoneIcon className="h-5 w-5" /> Thông tin chiến dịch
                    </h3>
                    <Input
                        label="Tên chiến dịch"
                        placeholder="Chiến dịch Tết 2024"
                        variant="bordered"
                        radius="lg"
                        isRequired
                    />
                    <Select label="Loại chiến dịch" variant="bordered" radius="lg">
                        <SelectItem key="email">Email Marketing</SelectItem>
                        <SelectItem key="social">Mạng xã hội</SelectItem>
                        <SelectItem key="ads">Quảng cáo trả phí</SelectItem>
                        <SelectItem key="event">Sự kiện</SelectItem>
                        <SelectItem key="content">Content Marketing</SelectItem>
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="date" label="Ngày bắt đầu" variant="bordered" radius="lg" />
                        <Input type="date" label="Ngày kết thúc" variant="bordered" radius="lg" />
                    </div>
                    <Input
                        type="number"
                        label="Ngân sách (VNĐ)"
                        placeholder="10000000"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Mục tiêu"
                        placeholder="Tăng 20% leads, 10% conversions..."
                        variant="bordered"
                        radius="lg"
                    />
                    <Divider />
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full" as="a" href="/marketing/campaigns">
                            Hủy
                        </Button>
                        <Button color="default" variant="flat" radius="full">
                            Lưu nháp
                        </Button>
                        <Button color="primary" radius="full">
                            Khởi chạy
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
