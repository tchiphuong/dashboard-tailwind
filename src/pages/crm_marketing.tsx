import { useTranslation } from 'react-i18next';

// CRM
export function LeadListPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.leadList')} subtitle="Leads Management" />;
}
export function AddLeadPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.addLead')} subtitle="Add New Lead" />;
}
export function OpportunitiesPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.opportunities')} subtitle="Sales Opportunities" />;
}
export function ContactsPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.contacts')} subtitle="Contact Management" />;
}

// MARKETING
export function CampaignListPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.campaignList')} subtitle="Marketing Campaigns" />;
}
export function CreateCampaignPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.createCampaign')} subtitle="Create Campaign" />;
}
export function EmailMarketingPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.emailMarketing')} subtitle="Email Marketing" />;
}
export function SocialMediaPage() {
    const { t } = useTranslation();
    return <PlaceholderPage title={t('menu.socialMedia')} subtitle="Social Media Manager" />;
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
