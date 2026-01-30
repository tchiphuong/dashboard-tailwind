import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
} from '@heroui/react';
import {
    PaperAirplaneIcon,
    LightBulbIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';

const requestTypes = [
    { key: 'leave', labelKey: 'approvals.types.leave' },
    { key: 'expense', labelKey: 'approvals.types.expense' },
    { key: 'purchase', labelKey: 'approvals.types.purchase' },
    { key: 'travel', labelKey: 'approvals.types.travel' },
    { key: 'overtime', labelKey: 'approvals.types.overtime' },
];

export function ApprovalsSubmit() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [requestType, setRequestType] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        // Reset form
        setRequestType('');
        setTitle('');
        setDescription('');
        alert(t('approvals.submitSuccess'));
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('menu.approvals'), href: '/approvals/pending' },
                    { label: t('menu.submitRequest') },
                ]}
            />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('menu.submitRequest')}
                </h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {t('approvals.submitDescription')}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Form */}
                <div className="lg:col-span-2">
                    <Card className="border border-zinc-200 shadow-lg dark:border-zinc-700">
                        <CardHeader className="border-b border-zinc-200 bg-gray-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                {t('approvals.newRequest')}
                            </h2>
                        </CardHeader>
                        <CardBody className="p-6">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <Select
                                    label={t('approvals.requestType')}
                                    labelPlacement="outside"
                                    placeholder={t('approvals.selectType')}
                                    selectedKeys={requestType ? [requestType] : []}
                                    onSelectionChange={(keys) =>
                                        setRequestType(Array.from(keys)[0] as string)
                                    }
                                    isRequired
                                    radius="full"
                                >
                                    {requestTypes.map((type) => (
                                        <SelectItem key={type.key}>{t(type.labelKey)}</SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    label={t('approvals.title')}
                                    labelPlacement="outside"
                                    placeholder={t('approvals.titlePlaceholder')}
                                    value={title}
                                    onValueChange={setTitle}
                                    isRequired
                                    radius="full"
                                />

                                <Textarea
                                    label={t('approvals.description')}
                                    labelPlacement="outside"
                                    placeholder={t('approvals.descriptionPlaceholder')}
                                    value={description}
                                    onValueChange={setDescription}
                                    minRows={4}
                                    isRequired
                                    radius="full"
                                />

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="bordered"
                                        radius="full"
                                        onPress={() => {
                                            setRequestType('');
                                            setTitle('');
                                            setDescription('');
                                        }}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        radius="full"
                                        isLoading={loading}
                                        startContent={
                                            !loading && <PaperAirplaneIcon className="h-4 w-4" />
                                        }
                                    >
                                        {t('menu.submitRequest')}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Info & Guidelines */}
                <div className="space-y-6">
                    {/* Guidelines Card */}
                    <Card className="border border-blue-100 bg-blue-50/50 shadow-sm dark:border-blue-900/30 dark:bg-blue-900/10">
                        <CardHeader className="flex gap-3 px-6 pt-6 pb-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <LightBulbIcon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-md font-semibold text-gray-800 dark:text-gray-100">
                                    {t('approvals.guidelines')}
                                </p>
                                <p className="text-small text-gray-500 dark:text-gray-400">
                                    Please read before submitting
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 pt-2 pb-6">
                            <ul className="list-inside list-disc space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <li>
                                    Submit leave requests at least <b>3 days</b> in advance.
                                </li>
                                <li>
                                    Attach receipts for all expense claims over <b>$50</b>.
                                </li>
                                <li>Verify your remaining leave balance before applying.</li>
                                <li>
                                    Emergency requests should be communicated directly to your
                                    manager.
                                </li>
                            </ul>
                        </CardBody>
                    </Card>

                    {/* Support Card */}
                    <Card className="border border-zinc-200 shadow-sm dark:border-zinc-700">
                        <CardHeader className="flex gap-3 px-6 pt-6 pb-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-400">
                                <QuestionMarkCircleIcon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-md font-semibold text-gray-800 dark:text-gray-100">
                                    {t('approvals.needHelp')}
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody className="px-6 pt-2 pb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                If you have any questions or encounter issues, please contact the HR
                                department at:
                            </p>
                            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                                📧 hr@company.com
                                <br />
                                📞 Ext. 1234
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}
