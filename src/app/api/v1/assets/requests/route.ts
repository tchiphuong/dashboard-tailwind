import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response-helper";
import type { AssetRequestItem } from "@/types";

// eslint-disable-next-line prefer-const -- Mutated via index in PATCH handler
let assetRequests: AssetRequestItem[] = [
    {
        id: 'req-1',
        requesterName: 'Hoàng Kim Oanh',
        department: 'Phòng Nhân sự',
        assetType: 'Tai nghe chống ồn Sony WH-1000XM5',
        reason: 'Phục vụ phỏng vấn ứng viên từ xa qua Google Meet',
        requestDate: '2026-09-25',
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'req-2',
        requesterName: 'Nguyễn Văn Hùng',
        department: 'Ban Giám Đốc',
        assetType: 'iPad Pro 11" M4 + Apple Pencil Pro',
        reason: 'Trình chiếu báo cáo tại hội nghị đối tác chiến lược',
        requestDate: '2026-09-20',
        status: 'approved',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'req-3',
        requesterName: 'Vũ Quốc Bảo',
        department: 'Khối Kỹ thuật IT',
        assetType: 'Bàn phím cơ Keychron Q1 Pro',
        reason: 'Thay thế bàn phím văn phòng bị kẹt phím Spacebar',
        requestDate: '2026-09-18',
        status: 'rejected',
        createdAt: new Date().toISOString(),
    },
];

export async function GET() {
    return successResponse(assetRequests, "Lấy danh sách yêu cầu cấp phát tài sản thành công");
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status || !['pending', 'approved', 'rejected'].includes(status)) {
            return errorResponse("Trạng thái hoặc mã yêu cầu không hợp lệ", 400);
        }

        const foundIndex = assetRequests.findIndex(r => r.id === id);
        if (foundIndex === -1) {
            return errorResponse("Không tìm thấy yêu cầu cấp phát này", 404);
        }

        assetRequests[foundIndex] = {
            ...assetRequests[foundIndex],
            status,
            updatedAt: new Date().toISOString(),
        };

        return successResponse(
            assetRequests[foundIndex],
            status === 'approved' ? 'Đã duyệt cấp phát tài sản thành công' : 'Đã từ chối yêu cầu cấp phát'
        );
    } catch {
        return errorResponse("Không thể xử lý yêu cầu", 400);
    }
}
