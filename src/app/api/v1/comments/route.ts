import { NextRequest } from "next/server";

import { errorResponse, pagedSuccessResponse, successResponse } from "@/lib/api-response-helper";
import type { Comment } from "@/types";

interface DummyCommentResponse {
    id: number;
    body: string;
    postId: number;
    user: {
        id: number;
        username: string;
        fullName?: string;
    };
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
        const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
        const skip = (pageIndex - 1) * pageSize;

        const res = await fetch(`https://dummyjson.com/comments?limit=${pageSize}&skip=${skip}`, {
            headers: { Accept: "application/json" },
            next: { revalidate: 30 },
        });

        if (!res.ok) {
            throw new Error(`Lỗi từ public comments API: ${res.status}`);
        }

        const json = await res.json();
        const items: Comment[] = (json.comments || []).map((c: DummyCommentResponse) => ({
            id: c.id,
            body: c.body,
            postId: c.postId,
            user: {
                id: c.user.id,
                username: c.user.username,
                fullName: c.user.fullName || c.user.username,
            },
            createdAt: new Date().toISOString(),
        }));

        const totalItems = json.total || items.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return pagedSuccessResponse<Comment>(items, {
            pageIndex,
            pageSize,
            totalItems,
            totalPages,
        });
    } catch {
        const fallbackComments: Comment[] = [
            { id: 1, body: "Hệ thống quản lý rất trực quan và mượt mà.", postId: 101, user: { id: 1, username: "admin", fullName: "Quản trị viên" } },
            { id: 2, body: "Cần bổ sung thêm báo cáo xuất Excel theo quý.", postId: 102, user: { id: 2, username: "manager", fullName: "Trưởng phòng" } },
        ];

        return pagedSuccessResponse<Comment>(fallbackComments, {
            pageIndex: 1,
            pageSize: 10,
            totalItems: fallbackComments.length,
            totalPages: 1,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const newId = Date.now();
        return successResponse({ id: newId, ...body }, "Tạo bình luận mới thành công", 201);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Tạo bình luận thất bại";
        return errorResponse(message, [message], 400);
    }
}
