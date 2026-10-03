// Re-export shared types and data from CRM for marketing pages
export type { Campaign, EmailCampaign, SocialPost } from '../crm/shared';

export {
    mockCampaigns,
    mockEmailCampaigns,
    mockSocialPosts,
    createFetchFn,
    formatCurrency,
} from '../crm/shared';
