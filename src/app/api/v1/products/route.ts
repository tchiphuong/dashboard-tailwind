import { NextRequest } from "next/server";

import { errorResponse, pagedSuccessResponse, successResponse } from "@/lib/api-response-helper";
import type { Product } from "@/types";

interface DummyProductResponse {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    stock: number;
    category: string;
    thumbnail: string;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
        const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
        const keyword = searchParams.get("keyword")?.trim() || "";
        const skip = (pageIndex - 1) * pageSize;

        // Gọi public API từ DummyJSON Products (theo chuẩn RESTful)
        const fetchUrl = keyword
            ? `https://dummyjson.com/products/search?q=${encodeURIComponent(keyword)}&limit=${pageSize}&skip=${skip}`
            : `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`;

        const res = await fetch(fetchUrl, {
            headers: { Accept: "application/json" },
            next: { revalidate: 30 },
        });

        if (!res.ok) {
            throw new Error(`Lỗi từ public products API: ${res.status}`);
        }

        const json = await res.json();
        const items: Product[] = (json.products || []).map((p: DummyProductResponse) => ({
            id: p.id,
            title: p.title,
            name: p.title,
            description: p.description,
            price: p.price,
            rating: p.rating,
            stock: p.stock,
            category: p.category,
            thumbnail: p.thumbnail,
            sales: Math.floor(p.price * 25),
            revenue: Math.floor(p.price * p.stock * 15),
            growth: Number(((p.rating - 3) * 10).toFixed(1)),
            status: p.stock > 0 ? "InStock" : "OutOfStock",
            createdAt: new Date().toISOString(),
        }));

        const totalItems = json.total || items.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return pagedSuccessResponse<Product>(items, {
            pageIndex,
            pageSize,
            totalItems,
            totalPages,
        });
    } catch {
        // Fallback danh sách tĩnh nếu mạng offline
        const fallbackProducts: Product[] = [
            { id: 1, title: "MacBook Pro M3 Max", name: "MacBook Pro M3 Max", price: 3499, rating: 4.9, stock: 15, category: "Laptops", sales: 120, revenue: 419880, growth: 12.5, status: "InStock" },
            { id: 2, title: "iPhone 16 Pro Max", name: "iPhone 16 Pro Max", price: 1199, rating: 4.8, stock: 45, category: "Smartphones", sales: 340, revenue: 407660, growth: 18.2, status: "InStock" },
            { id: 3, title: "Dell XPS 16", name: "Dell XPS 16", price: 2299, rating: 4.6, stock: 8, category: "Laptops", sales: 85, revenue: 195415, growth: -2.4, status: "InStock" },
        ];

        return pagedSuccessResponse<Product>(fallbackProducts, {
            pageIndex: 1,
            pageSize: 10,
            totalItems: fallbackProducts.length,
            totalPages: 1,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const newId = Date.now();
        return successResponse({ id: newId, ...body }, "Tạo sản phẩm mới thành công", 201);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Tạo sản phẩm thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        return successResponse({ deleted: body?.ids || [] }, "Xóa sản phẩm thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa sản phẩm thất bại";
        return errorResponse(message, [message], 400);
    }
}
