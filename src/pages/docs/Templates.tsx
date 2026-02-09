import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Card, CardBody, SelectItem } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Modal as CommonModal, Input, Select } from '@/components/common';
import { mockTemplates } from './shared';

export function TemplatesPage() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'docx':
                return '📝';
            case 'xlsx':
                return '📊';
            case 'pdf':
                return '📄';
            case 'pptx':
                return '📽️';
            default:
                return '📁';
        }
    };

    return (
        <>
            <PageHeader
                title={t('menu.templates')}
                breadcrumbs={[{ label: t('menu.group.documents') }, { label: 'Mẫu tài liệu' }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm mẫu
                    </Button>
                }
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTemplates.map((template) => (
                    <Card
                        key={template.id}
                        isPressable
                        className="transition-shadow hover:shadow-lg"
                    >
                        <CardBody className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{getFileIcon(template.fileType)}</div>
                                <div className="flex-1">
                                    <h3 className="font-bold">{template.name}</h3>
                                    <p className="mb-2 text-sm text-gray-500">
                                        {template.description}
                                    </p>
                                    <div className="flex gap-3 text-xs text-gray-400">
                                        <Chip size="sm" variant="flat">
                                            {template.category}
                                        </Chip>
                                        <span>⬇️ {template.downloads}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    radius="full"
                                    className="flex-1"
                                >
                                    Tải xuống
                                </Button>
                                <Button size="sm" variant="bordered" radius="full">
                                    Xem
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm mẫu tài liệu"
            >
                <div className="flex flex-col gap-4">
                    <Input label="Tên mẫu" variant="bordered" radius="lg" />
                    <Select label="Danh mục" variant="bordered" radius="lg">
                        <SelectItem key="hr">Nhân sự</SelectItem>
                        <SelectItem key="report">Báo cáo</SelectItem>
                        <SelectItem key="project">Dự án</SelectItem>
                        <SelectItem key="meeting">Cuộc họp</SelectItem>
                    </Select>
                    <Input label="Mô tả" variant="bordered" radius="lg" />
                    <Input type="file" label="Tải lên file mẫu" variant="bordered" radius="lg" />
                </div>
            </CommonModal>
        </>
    );
}
