import { NextRequest } from "next/server";
import { pagedSuccessResponse, successResponse, errorResponse } from "@/lib/api-response-helper";
import type { PostItem } from "@/types";

interface DummyPostResponse {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
    views: number;
    userId: number;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
    const skip = (pageIndex - 1) * pageSize;
    // category param reserved for future filter
    const search = searchParams.get("search")?.toLowerCase();

    try {
        // Tận dụng Public API DummyJSON (thuộc kho 1.563 APIs apis.j2team.org)
        const fetchUrl = search
            ? `https://dummyjson.com/posts/search?q=${encodeURIComponent(search)}&limit=${pageSize}&skip=${skip}`
            : `https://dummyjson.com/posts?limit=${pageSize}&skip=${skip}`;

        const res = await fetch(fetchUrl, {
            headers: { Accept: "application/json" },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Lỗi từ public posts API: ${res.status}`);
        }

        const json = await res.json();
        const rawPosts = json.posts || [];

        const categoriesMap = ["Tin doanh nghiệp", "Công nghệ & Sản phẩm", "Văn hóa nội bộ", "Chiến lược phát triển"];

        const items: PostItem[] = rawPosts.map((p: DummyPostResponse, idx: number) => ({
            id: p.id,
            title: p.title,
            slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            author: p.userId % 2 === 0 ? "Ban Giám Đốc" : "Phòng Kỹ thuật IT",
            category: categoriesMap[p.id % categoriesMap.length],
            body: p.body,
            tags: p.tags,
            views: p.views || (p.reactions?.likes || 0) * 12 + 100,
            publishDate: new Date(Date.now() - (idx + 1) * 86400000).toISOString().slice(0, 10),
            status: "published",
            createdAt: new Date().toISOString(),
        }));

        const totalItems = json.total || items.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return pagedSuccessResponse<PostItem>(items, {
            pageIndex,
            pageSize,
            totalItems,
            totalPages,
        });
    } catch {
        // Mock fallback an toàn theo rule khi mạng offline hoặc API ngoài chậm
        const fallbackPosts: PostItem[] = [
            {
                id: 1,
                title: "Công bố kết quả kinh doanh quý 3/2026: Tăng trưởng 18.5% toàn diện",
                slug: "ket-qua-kinh-doanh-q3-2026",
                author: "Ban Giám Đốc",
                category: "Tin doanh nghiệp",
                views: 1420,
                publishDate: "2026-09-25",
                status: "published",
                createdAt: new Date().toISOString(),
            },
            {
                id: 2,
                title: "Ra mắt giải pháp tích hợp VietQR và đồng bộ tỷ giá cho khách hàng B2B",
                slug: "ra-mat-vietqr-b2b",
                author: "Phòng Kỹ thuật IT",
                category: "Công nghệ & Sản phẩm",
                views: 890,
                publishDate: "2026-09-22",
                status: "published",
                createdAt: new Date().toISOString(),
            },
            {
                id: 3,
                title: "Chính sách khen thưởng và vinh danh nhân viên xuất sắc tháng 9",
                slug: "khen-thuong-nhan-vien-thang-9",
                author: "Phòng Nhân sự HR",
                category: "Văn hóa nội bộ",
                views: 2150,
                publishDate: "2026-09-18",
                status: "published",
                createdAt: new Date().toISOString(),
            },
        ];

        return pagedSuccessResponse<PostItem>(fallbackPosts, {
            pageIndex: 1,
            pageSize: 10,
            totalItems: fallbackPosts.length,
            totalPages: 1,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.title) {
            return errorResponse("Tiêu đề bài viết không được để trống", 400);
        }

        const newPost: PostItem = {
            id: Date.now(),
            title: body.title,
            slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            author: "Tôi (Kỹ sư IT)",
            category: body.category || "Tin doanh nghiệp",
            body: body.body || "",
            views: 1,
            publishDate: new Date().toISOString().slice(0, 10),
            status: body.status || "published",
            createdAt: new Date().toISOString(),
        };

        return successResponse(newPost, "Tạo bài viết mới thành công", 201);
    } catch {
        return errorResponse("Dữ liệu không hợp lệ", 400);
    }
}
