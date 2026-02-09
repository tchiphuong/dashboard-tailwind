import { FetchParams, PagedResult } from '@/components/common';

// ==================== TYPES ====================

export interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    source: 'website' | 'referral' | 'ads' | 'social' | 'cold_call';
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
    value: number;
    assignedTo: string;
    createdAt: string;
}

export interface Opportunity {
    id: number;
    name: string;
    customer: string;
    value: number;
    probability: number;
    stage:
        | 'prospecting'
        | 'qualification'
        | 'proposal'
        | 'negotiation'
        | 'closed_won'
        | 'closed_lost';
    expectedClose: string;
    assignedTo: string;
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    position: string;
    avatar: string;
    lastContact: string;
    tags: string[];
}

export interface Campaign {
    id: number;
    name: string;
    type: 'email' | 'social' | 'ads' | 'event' | 'content';
    status: 'draft' | 'active' | 'paused' | 'completed';
    budget: number;
    spent: number;
    leads: number;
    conversions: number;
    startDate: string;
    endDate: string;
}

export interface EmailCampaign {
    id: number;
    name: string;
    subject: string;
    recipients: number;
    sent: number;
    opened: number;
    clicked: number;
    status: 'draft' | 'scheduled' | 'sending' | 'sent';
    scheduledAt: string | null;
}

export interface SocialPost {
    id: number;
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
    content: string;
    status: 'draft' | 'scheduled' | 'published';
    likes: number;
    comments: number;
    shares: number;
    scheduledAt: string | null;
    publishedAt: string | null;
}

// ==================== MOCK DATA ====================

export const mockLeads: Lead[] = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: `Lead ${i + 1}`,
    email: `lead${i + 1}@email.com`,
    phone: `0${900000000 + i}`,
    company: `Công ty ${String.fromCharCode(65 + (i % 26))}`,
    source: (['website', 'referral', 'ads', 'social', 'cold_call'] as const)[i % 5],
    status: (['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const)[i % 6],
    value: (i + 1) * 5000000,
    assignedTo: `Sales ${(i % 5) + 1}`,
    createdAt: new Date(2024, 0, i + 1).toISOString().split('T')[0],
}));

export const mockOpportunities: Opportunity[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Dự án ${i + 1}`,
    customer: mockLeads[i % 20].name,
    value: (i + 1) * 10000000,
    probability: [10, 25, 50, 75, 90, 0][i % 6],
    stage: (
        [
            'prospecting',
            'qualification',
            'proposal',
            'negotiation',
            'closed_won',
            'closed_lost',
        ] as const
    )[i % 6],
    expectedClose: new Date(2024, (i % 12) + 1, 15).toISOString().split('T')[0],
    assignedTo: `Sales ${(i % 5) + 1}`,
}));

export const mockContacts: Contact[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `${['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng'][i % 5]} ${['Văn', 'Thị', 'Minh', 'Hồng'][i % 4]} ${String.fromCharCode(65 + (i % 26))}`,
    email: `contact${i + 1}@email.com`,
    phone: `0${900000000 + i}`,
    company: `Công ty ${String.fromCharCode(65 + (i % 26))}`,
    position: ['CEO', 'Manager', 'Director', 'Staff', 'Executive'][i % 5],
    avatar: `https://i.pravatar.cc/150?u=contact${i + 1}`,
    lastContact: new Date(2024, 0, 30 - (i % 30)).toISOString().split('T')[0],
    tags: [['VIP', 'Partner'], ['Lead', 'New'], ['Customer', 'Active'], ['Prospect']][i % 4],
}));

export const mockCampaigns: Campaign[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Chiến dịch ${i + 1}`,
    type: (['email', 'social', 'ads', 'event', 'content'] as const)[i % 5],
    status: (['draft', 'active', 'paused', 'completed'] as const)[i % 4],
    budget: (i + 1) * 5000000,
    spent: (i + 1) * 3000000,
    leads: (i + 1) * 10,
    conversions: (i + 1) * 2,
    startDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    endDate: new Date(2024, 1, i + 15).toISOString().split('T')[0],
}));

export const mockEmailCampaigns: EmailCampaign[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Email Campaign ${i + 1}`,
    subject: `[Khuyến mãi] Ưu đãi đặc biệt tháng ${(i % 12) + 1}`,
    recipients: (i + 1) * 1000,
    sent: (i + 1) * 950,
    opened: (i + 1) * 400,
    clicked: (i + 1) * 100,
    status: (['draft', 'scheduled', 'sending', 'sent'] as const)[i % 4],
    scheduledAt: i % 4 === 1 ? new Date(2024, 0, i + 5).toISOString() : null,
}));

export const mockSocialPosts: SocialPost[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    platform: (['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'] as const)[i % 5],
    content: `Bài viết số ${i + 1}: Nội dung hấp dẫn về sản phẩm/dịch vụ của chúng tôi! #marketing #business`,
    status: (['draft', 'scheduled', 'published'] as const)[i % 3],
    likes: i % 3 === 2 ? (i + 1) * 50 : 0,
    comments: i % 3 === 2 ? (i + 1) * 5 : 0,
    shares: i % 3 === 2 ? (i + 1) * 2 : 0,
    scheduledAt: i % 3 === 1 ? new Date(2024, 0, i + 3).toISOString() : null,
    publishedAt: i % 3 === 2 ? new Date(2024, 0, i + 1).toISOString() : null,
}));

// ==================== HELPERS ====================

export const createFetchFn =
    <T>(data: T[]) =>
    async (params: FetchParams): Promise<PagedResult<T>> => {
        await new Promise((r) => setTimeout(r, 300));
        let filtered = [...data];
        if (params.search) {
            const search = params.search.toLowerCase();
            filtered = filtered.filter((item) =>
                JSON.stringify(item).toLowerCase().includes(search)
            );
        }
        const start = (params.page - 1) * params.pageSize;
        const items = filtered.slice(start, start + params.pageSize);
        return {
            items,
            paging: {
                pageIndex: params.page,
                pageSize: params.pageSize,
                totalItems: filtered.length,
                totalPages: Math.ceil(filtered.length / params.pageSize),
            },
        };
    };

export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
