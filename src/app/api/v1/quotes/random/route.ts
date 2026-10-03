import { successResponse } from "@/lib/api-response-helper";
import type { Quote } from "@/types";

export async function GET() {
    try {
        const res = await fetch("https://dummyjson.com/quotes/random", {
            headers: { Accept: "application/json" },
            next: { revalidate: 0 },
        });

        if (res.ok) {
            const q = await res.json();
            const quote: Quote = {
                id: q.id,
                quote: q.quote,
                author: q.author,
            };
            return successResponse(quote, "Lấy trích dẫn ngẫu nhiên thành công");
        }

        return successResponse<Quote>({
            id: 1,
            quote: "Hành trình vạn dặm khởi đầu từ một bước chân.",
            author: "Lão Tử",
        }, "Lấy trích dẫn ngẫu nhiên thành công");
    } catch {
        return successResponse<Quote>({
            id: 1,
            quote: "Sự kiên trì là chìa khóa mở mọi cánh cửa dẫn đến thành công.",
            author: "Khuyết danh",
        }, "Lấy trích dẫn ngẫu nhiên thành công");
    }
}
