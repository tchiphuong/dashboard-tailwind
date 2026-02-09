import { FetchParams, PagedResult } from '@/components/common';

// ==================== TYPES ====================

export interface KnowledgeArticle {
    id: number;
    title: string;
    category: string;
    content: string;
    views: number;
    helpful: number;
    author: string;
    createdAt: string;
    updatedAt: string;
}

export interface DocTemplate {
    id: number;
    name: string;
    category: string;
    description: string;
    fileType: 'docx' | 'xlsx' | 'pdf' | 'pptx';
    downloads: number;
    updatedAt: string;
}

export interface DigitalSignature {
    id: number;
    documentName: string;
    requester: string;
    signers: string[];
    status: 'pending' | 'partial' | 'completed' | 'expired';
    createdAt: string;
    completedAt: string | null;
}

// ==================== MOCK DATA ====================

export const mockKnowledge: KnowledgeArticle[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    title: [
        'Hướng dẫn kết nối VPN',
        'Cách đổi mật khẩu email',
        'Thiết lập máy in mạng',
        'Sử dụng Microsoft Teams',
        'Backup dữ liệu cá nhân',
    ][i % 5],
    category: ['Mạng', 'Email', 'Phần cứng', 'Phần mềm', 'Bảo mật'][i % 5],
    content: 'Nội dung hướng dẫn chi tiết...',
    views: (i + 1) * 50,
    helpful: (i + 1) * 10,
    author: `IT Team`,
    createdAt: new Date(2023, i % 12, 1).toISOString(),
    updatedAt: new Date(2024, 0, i + 1).toISOString(),
}));

export const mockTemplates: DocTemplate[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: [
        'Hợp đồng lao động',
        'Báo cáo công việc',
        'Đề xuất dự án',
        'Biên bản họp',
        'Thuyết trình sản phẩm',
        'Bảng tính lương',
    ][i % 6],
    category: ['Nhân sự', 'Báo cáo', 'Dự án', 'Cuộc họp', 'Marketing', 'Kế toán'][i % 6],
    description: 'Mẫu tài liệu chuẩn...',
    fileType: (['docx', 'xlsx', 'pdf', 'pptx'] as const)[i % 4],
    downloads: (i + 1) * 25,
    updatedAt: new Date(2024, 0, i + 1).toISOString().split('T')[0],
}));

export const mockSignatures: DigitalSignature[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    documentName: `Hợp đồng ${i + 1}`,
    requester: `Người yêu cầu ${i + 1}`,
    signers: [`Người ký ${i + 1}`, `Người ký ${i + 2}`],
    status: (['pending', 'partial', 'completed', 'expired'] as const)[i % 4],
    createdAt: new Date(2024, 0, i + 1).toISOString(),
    completedAt: i % 4 === 2 ? new Date(2024, 0, i + 5).toISOString() : null,
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
