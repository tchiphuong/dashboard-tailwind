import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";
import type { Product } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const res = await fetch(`https://dummyjson.com/products/${id}`, {
            headers: { Accept: "application/json" },
        });

        if (res.ok) {
            const p = await res.json();
            const product: Product = {
                id: p.id,
                title: p.title,
                name: p.title,
                description: p.description,
                price: p.price,
                rating: p.rating,
                stock: p.stock,
                category: p.category,
                thumbnail: p.thumbnail,
                status: "InStock",
            };
            return successResponse(product, "Lấy thông tin sản phẩm thành công");
        }

        return successResponse<Product>({
            id: Number(id) || 1,
            title: `Sản phẩm ${id}`,
            name: `Sản phẩm ${id}`,
            price: 99,
            rating: 4.5,
            stock: 20,
            status: "InStock",
        }, "Lấy thông tin sản phẩm thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Lỗi khi lấy thông tin sản phẩm";
        return errorResponse(message, [message], 404);
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        return successResponse({ id: Number(id), ...body }, "Cập nhật sản phẩm thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Cập nhật sản phẩm thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        return successResponse({ id: Number(id) }, "Xóa sản phẩm thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa sản phẩm thất bại";
        return errorResponse(message, [message], 400);
    }
}
