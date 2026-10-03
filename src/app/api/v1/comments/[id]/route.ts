import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";
import type { Comment } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const res = await fetch(`https://dummyjson.com/comments/${id}`, {
            headers: { Accept: "application/json" },
        });

        if (res.ok) {
            const c = await res.json();
            const comment: Comment = {
                id: c.id,
                body: c.body,
                postId: c.postId,
                user: {
                    id: c.user.id,
                    username: c.user.username,
                    fullName: c.user.fullName || c.user.username,
                },
            };
            return successResponse(comment, "Lấy bình luận thành công");
        }

        return successResponse<Comment>({
            id: Number(id) || 1,
            body: `Bình luận số ${id}`,
            postId: 1,
            user: { id: 1, username: "user", fullName: "Người dùng" },
        }, "Lấy bình luận thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Lỗi khi lấy bình luận";
        return errorResponse(message, [message], 404);
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        return successResponse({ id: Number(id) }, "Xóa bình luận thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa bình luận thất bại";
        return errorResponse(message, [message], 400);
    }
}
