import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardBody, Input } from '@heroui/compat';
import { PageHeader, Table } from '@/components/common';
import { mockAccounts, mockJournals, formatCurrency } from '../shared';

export function GeneralLedgerPage() {
    const t = useTranslations();
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
                        <Table variant="secondary">
                            <Table.ScrollContainer>
                                <Table.Content aria-label="Bảng dữ liệu Sổ cái">
                                    <Table.Header>
                                        <Table.Column isRowHeader>Ngày</Table.Column>
                                        <Table.Column>Chứng từ</Table.Column>
                                        <Table.Column>Diễn giải</Table.Column>
                                        <Table.Column className="text-right">Nợ</Table.Column>
                                        <Table.Column className="text-right">Có</Table.Column>
                                        <Table.Column className="text-right">Số dư</Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {mockLedgerEntries.map((entry, i) => (
                                            <Table.Row key={entry.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                                <Table.Cell className="tabular-nums">{entry.date}</Table.Cell>
                                                <Table.Cell className="font-mono text-blue-600">
                                                    {entry.entryNumber}
                                                </Table.Cell>
                                                <Table.Cell>{entry.description}</Table.Cell>
                                                <Table.Cell className="text-right tabular-nums">
                                                    {i % 2 === 0 ? formatCurrency(entry.amount) : '-'}
                                                </Table.Cell>
                                                <Table.Cell className="text-right tabular-nums">
                                                    {i % 2 === 1 ? formatCurrency(entry.amount) : '-'}
                                                </Table.Cell>
                                                <Table.Cell className="text-right font-semibold tabular-nums">
                                                    {formatCurrency(entry.balance)}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Content>
                            </Table.ScrollContainer>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
