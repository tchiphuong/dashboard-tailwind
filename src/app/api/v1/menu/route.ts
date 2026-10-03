import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api-response-helper';
import dummyMenu from '@/data/dummy-menu.json';
import { NavbarItem } from '@/types';

/**
 * GET /api/v1/menu
 * Lấy danh sách menu hệ thống (Dummy JSON fallback / sẵn sàng tích hợp backend thật)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const group = searchParams.get('group');

        let items: NavbarItem[] = dummyMenu as NavbarItem[];

        if (group) {
            items = items.filter((item) => item.group === group);
        }

        return successResponse(items, 'Lấy danh sách menu thành công');
    } catch {
        return successResponse(
            dummyMenu as NavbarItem[],
            'Lấy danh sách menu thành công (fallback)'
        );
    }
}
