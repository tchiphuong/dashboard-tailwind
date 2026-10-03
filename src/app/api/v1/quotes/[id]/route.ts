import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";
import type { Quote } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const res = await fetch(`https://dummyjson.com/quotes/${id}`, {
            headers: { Accept: "application/json" },
        });

        if (res.ok) {
            const q = await res.json();
            const quote: Quote = {
                id: q.id,
                quote: q.quote,
                author: q.author,
            };
            return successResponse(quote, "Lấy trích dẫn thành công");
        }

        return successResponse<Quote>({
            id: Number(id) || 1,
            quote: "Trích dẫn mẫu cho hệ thống quản trị.",
            author: "UniManage Team",
        }, "Lấy trích dẫn thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Lỗi khi lấy trích dẫn";
        return errorResponse(message, [message], 404);
    }
}
