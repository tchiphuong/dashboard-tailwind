import { FetchParams, PagedResult } from '@/components/common';

// ==================== TYPES ====================

export interface SupportTicket {
    id: number;
    ticketNumber: string;
    subject: string;
    description: string;
    category: 'hardware' | 'software' | 'network' | 'access' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'inprogress' | 'pending' | 'resolved' | 'closed';
    requester: string;
    assignedTo: string | null;
    createdAt: string;
    resolvedAt: string | null;
}

export interface ITAsset {
    id: number;
    assetTag: string;
    name: string;
    type: 'laptop' | 'desktop' | 'monitor' | 'printer' | 'server' | 'network' | 'phone' | 'other';
    brand: string;
    model: string;
    serial: string;
    assignedTo: string | null;
    location: string;
    status: 'available' | 'inuse' | 'maintenance' | 'retired';
    purchaseDate: string;
    warrantyExpiry: string;
}

// ==================== MOCK DATA ====================

export const mockTickets: SupportTicket[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    ticketNumber: `TK${String(i + 1).padStart(5, '0')}`,
    subject: [
        'Máy tính không khởi động',
        'Không kết nối được mạng',
        'Yêu cầu cài phần mềm',
        'Máy in lỗi',
        'Quên mật khẩu',
    ][i % 5],
    description: 'Mô tả chi tiết vấn đề...',
    category: (['hardware', 'software', 'network', 'access', 'other'] as const)[i % 5],
    priority: (['low', 'medium', 'high', 'urgent'] as const)[i % 4],
    status: (['open', 'inprogress', 'pending', 'resolved', 'closed'] as const)[i % 5],
    requester: `Nhân viên ${i + 1}`,
    assignedTo: i % 5 !== 0 ? `IT Support ${(i % 3) + 1}` : null,
    createdAt: new Date(2024, 0, i + 1).toISOString(),
    resolvedAt: i % 5 === 4 ? new Date(2024, 0, i + 3).toISOString() : null,
}));

export const mockITAssets: ITAsset[] = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    assetTag: `IT${String(i + 1).padStart(5, '0')}`,
    name: [
        'MacBook Pro 14"',
        'Dell Latitude 5520',
        'HP Monitor 27"',
        'Canon Printer',
        'Dell PowerEdge',
        'Cisco Switch',
        'iPhone 15',
        'Webcam Logitech',
    ][i % 8],
    type: (
        ['laptop', 'desktop', 'monitor', 'printer', 'server', 'network', 'phone', 'other'] as const
    )[i % 8],
    brand: ['Apple', 'Dell', 'HP', 'Canon', 'Dell', 'Cisco', 'Apple', 'Logitech'][i % 8],
    model: `Model ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
    serial: `SN${String(Math.random()).slice(2, 14)}`,
    assignedTo: i % 3 !== 0 ? `Nhân viên ${i + 1}` : null,
    location: ['Văn phòng HN', 'Văn phòng HCM', 'Văn phòng ĐN', 'Kho IT'][i % 4],
    status: (['available', 'inuse', 'maintenance', 'retired'] as const)[i % 4],
    purchaseDate: new Date(2022, i % 12, 1).toISOString().split('T')[0],
    warrantyExpiry: new Date(2025, i % 12, 1).toISOString().split('T')[0],
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
