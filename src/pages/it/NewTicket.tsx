import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, Divider, SelectItem } from '@heroui/react';
import { TicketIcon } from '@heroicons/react/24/outline';
import { PageHeader, Input, Select } from '@/components/common';

export function NewTicketPage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('menu.newTicket')}
                breadcrumbs={[
                    { label: t('menu.group.it') },
                    { label: 'Phiếu hỗ trợ' },
                    { label: 'Tạo mới' },
                ]}
            />
            <Card className="mx-auto max-w-2xl">
                <CardBody className="space-y-4 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                        <TicketIcon className="h-5 w-5" /> Tạo phiếu hỗ trợ
                    </h3>
                    <Input
                        label="Tiêu đề"
                        placeholder="Mô tả ngắn gọn vấn đề"
                        variant="bordered"
                        radius="lg"
                        isRequired
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Loại vấn đề" variant="bordered" radius="lg">
                            <SelectItem key="hardware">Phần cứng</SelectItem>
                            <SelectItem key="software">Phần mềm</SelectItem>
                            <SelectItem key="network">Mạng</SelectItem>
                            <SelectItem key="access">Truy cập/Tài khoản</SelectItem>
                            <SelectItem key="other">Khác</SelectItem>
                        </Select>
                        <Select label="Mức độ ưu tiên" variant="bordered" radius="lg">
                            <SelectItem key="low">Thấp</SelectItem>
                            <SelectItem key="medium">Trung bình</SelectItem>
                            <SelectItem key="high">Cao</SelectItem>
                            <SelectItem key="urgent">Khẩn cấp</SelectItem>
                        </Select>
                    </div>
                    <Input
                        label="Mô tả chi tiết"
                        placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                        variant="bordered"
                        radius="lg"
                        isRequired
                    />
                    <Input
                        type="file"
                        label="Đính kèm file (nếu có)"
                        variant="bordered"
                        radius="lg"
                    />
                    <Divider />
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full" as="a" href="/it/tickets">
                            Hủy
                        </Button>
                        <Button color="primary" radius="full">
                            Gửi phiếu
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
