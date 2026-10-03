import { NextRequest } from "next/server";

import { pagedSuccessResponse } from "@/lib/api-response-helper";
import type { Quote } from "@/types";

interface DummyQuoteResponse {
    id: number;
    quote: string;
    author: string;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
        const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
        const skip = (pageIndex - 1) * pageSize;

        const res = await fetch(`https://dummyjson.com/quotes?limit=${pageSize}&skip=${skip}`, {
            headers: { Accept: "application/json" },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Lỗi từ public quotes API: ${res.status}`);
        }

        const json = await res.json();
        const items: Quote[] = (json.quotes || []).map((q: DummyQuoteResponse) => ({
            id: q.id,
            quote: q.quote,
            author: q.author,
        }));

        const totalItems = json.total || items.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return pagedSuccessResponse<Quote>(items, {
            pageIndex,
            pageSize,
            totalItems,
            totalPages,
        });
    } catch {
        const fallbackQuotes: Quote[] = [
            { id: 1, quote: "Cuộc sống là những gì xảy ra khi bạn đang bận rộn lên những kế hoạch khác.", author: "John Lennon" },
            { id: 2, quote: "Cách duy nhất để làm nên việc tuyệt vời là yêu lấy việc bạn làm.", author: "Steve Jobs" },
        ];

        return pagedSuccessResponse<Quote>(fallbackQuotes, {
            pageIndex: 1,
            pageSize: 10,
            totalItems: fallbackQuotes.length,
            totalPages: 1,
        });
    }
}
