import { useTranslation } from 'react-i18next';
import { Chip, Card, CardBody } from '@heroui/react';
import { PageHeader } from '@/components/common';
import { mockOpportunities, formatCurrency } from './shared';

export function OpportunitiesPage() {
    const { t } = useTranslation();

    const stages = [
        'prospecting',
        'qualification',
        'proposal',
        'negotiation',
        'closed_won',
        'closed_lost',
    ];
    const stageLabels: Record<string, string> = {
        prospecting: 'Tìm kiếm',
        qualification: 'Đánh giá',
        proposal: 'Đề xuất',
        negotiation: 'Đàm phán',
        closed_won: 'Thắng',
        closed_lost: 'Mất',
    };
    const stageColors: Record<string, string> = {
        prospecting: 'bg-gray-100 dark:bg-gray-800',
        qualification: 'bg-blue-50 dark:bg-blue-900/30',
        proposal: 'bg-purple-50 dark:bg-purple-900/30',
        negotiation: 'bg-yellow-50 dark:bg-yellow-900/30',
        closed_won: 'bg-green-50 dark:bg-green-900/30',
        closed_lost: 'bg-red-50 dark:bg-red-900/30',
    };

    return (
        <>
            <PageHeader
                title={t('menu.opportunities')}
                breadcrumbs={[{ label: t('menu.group.crm') }, { label: t('menu.opportunities') }]}
            />
            <div className="grid grid-cols-6 gap-4 overflow-x-auto pb-4">
                {stages.map((stage) => (
                    <div
                        key={stage}
                        className={`min-w-[220px] rounded-xl p-4 ${stageColors[stage]}`}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-bold">{stageLabels[stage]}</h4>
                            <Chip size="sm" variant="flat">
                                {mockOpportunities.filter((o) => o.stage === stage).length}
                            </Chip>
                        </div>
                        <div className="space-y-3">
                            {mockOpportunities
                                .filter((o) => o.stage === stage)
                                .slice(0, 4)
                                .map((opp) => (
                                    <Card
                                        key={opp.id}
                                        className="cursor-pointer shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <CardBody className="p-3">
                                            <p className="text-sm font-semibold">{opp.name}</p>
                                            <p className="text-xs text-gray-500">{opp.customer}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-sm font-bold text-green-600">
                                                    {formatCurrency(opp.value)}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {opp.probability}%
                                                </span>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
