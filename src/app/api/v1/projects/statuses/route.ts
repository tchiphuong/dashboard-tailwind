import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/api-response-helper';
import type { ProjectStatusOption } from '@/types';

export async function GET() {
    const statuses: ProjectStatusOption[] = [
        { id: 'all', label: 'Tất cả trạng thái' },
        { id: 'in_progress', label: 'Đang triển khai' },
        { id: 'completed', label: 'Đã hoàn thành' },
        { id: 'planning', label: 'Lập kế hoạch' },
        { id: 'on_hold', label: 'Tạm dừng' },
    ];

    return NextResponse.json(successResponse(statuses));
}
