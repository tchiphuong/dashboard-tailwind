import { useTranslation } from 'react-i18next';

// ACCOUNTING
export function ChartOfAccountsPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.chartOfAccounts')} subtitle="Chart of Accounts" />;
}
export function JournalListPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.journalList')} subtitle="Journal Entries" />;
}
export function NewJournalEntryPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.newEntry')} subtitle="New Journal Entry" />;
}
export function GeneralLedgerPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.generalLedger')} subtitle="General Ledger" />;
}

// IT
export function TicketListPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.ticketList')} subtitle="Support Tickets" />;
}
export function NewTicketPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.newTicket')} subtitle="Create New Ticket" />;
}
export function ITAssetsPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.itAssets')} subtitle="IT Asset Management" />;
}
export function KnowledgeBasePage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.knowledgeBase')} subtitle="Knowledge Base" />;
}

// DOCUMENTS (ADDITIONS)
export function TemplatesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.templates')} subtitle="Document Templates" />;
}
export function SignaturesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.signatures')} subtitle="Digital Signatures" />;
}

// Reusable Placeholder
function PlaceholderPage({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                <p className="text-gray-500 dark:text-gray-400">{subtitle} - Coming Soon...</p>
            </div>
        </>
    );
}
