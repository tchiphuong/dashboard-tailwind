import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, Input } from '@heroui/react';
import { PageHeader } from '@/components/common';
import { mockAccounts, mockJournals, formatCurrency } from './shared';

export function GeneralLedgerPage() {
    const { t } = useTranslation();
    const [selectedAccount, setSelectedAccount] = useState<string>('111');

    const mockLedgerEntries = mockJournals.slice(0, 10).map((j, i) => ({
        ...j,
        balance: (i + 1) * 10000000,
    }));

    return (
        <>
            <PageHeader
                title={t('menu.generalLedger')}
                breadcrumbs={[{ label: t('menu.group.accounting') }, { label: 'Sổ cái' }]}
            />
            <div className="grid grid-cols-4 gap-6">
                <Card className="col-span-1">
                    <CardBody className="p-4">
                        <h4 className="mb-4 font-bold">Tài khoản</h4>
                        <div className="space-y-1">
                            {mockAccounts.slice(0, 10).map((account) => (
                                <div
                                    key={account.id}
                                    className={`cursor-pointer rounded-lg p-2 transition-colors ${selectedAccount === account.code ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                                    onClick={() => setSelectedAccount(account.code)}
                                >
                                    <span className="font-mono text-sm">{account.code}</span>
                                    <span className="ml-2 text-sm">{account.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
                <Card className="col-span-3">
                    <CardBody className="p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h4 className="font-bold">Sổ cái TK {selectedAccount}</h4>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    label="Từ ngày"
                                    size="sm"
                                    variant="bordered"
                                    radius="lg"
                                    className="w-40"
                                />
                                <Input
                                    type="date"
                                    label="Đến ngày"
                                    size="sm"
                                    variant="bordered"
                                    radius="lg"
                                    className="w-40"
                                />
                            </div>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b dark:border-zinc-700">
                                    <th className="p-2 text-left">Ngày</th>
                                    <th className="p-2 text-left">Chứng từ</th>
                                    <th className="p-2 text-left">Diễn giải</th>
                                    <th className="p-2 text-right">Nợ</th>
                                    <th className="p-2 text-right">Có</th>
                                    <th className="p-2 text-right">Số dư</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockLedgerEntries.map((entry, i) => (
                                    <tr
                                        key={entry.id}
                                        className="border-b hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                                    >
                                        <td className="p-2">{entry.date}</td>
                                        <td className="p-2 font-mono text-blue-600">
                                            {entry.entryNumber}
                                        </td>
                                        <td className="p-2">{entry.description}</td>
                                        <td className="p-2 text-right">
                                            {i % 2 === 0 ? formatCurrency(entry.amount) : '-'}
                                        </td>
                                        <td className="p-2 text-right">
                                            {i % 2 === 1 ? formatCurrency(entry.amount) : '-'}
                                        </td>
                                        <td className="p-2 text-right font-semibold">
                                            {formatCurrency(entry.balance)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
