import { NextRequest } from "next/server";

import { errorResponse, pagedSuccessResponse, successResponse } from "@/lib/api-response-helper";
import type { User } from "@/types";

interface DummyUserResponse {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
    age: number;
    role?: string;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
        const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
        const keyword = searchParams.get("keyword")?.trim() || "";
        const skip = (pageIndex - 1) * pageSize;

        // Gọi public API từ DummyJSON (thuộc nhóm Testing / Dummy Data theo danh mục J2Team)
        const fetchUrl = keyword
            ? `https://dummyjson.com/users/search?q=${encodeURIComponent(keyword)}&limit=${pageSize}&skip=${skip}`
            : `https://dummyjson.com/users?limit=${pageSize}&skip=${skip}`;

        const res = await fetch(fetchUrl, {
            headers: { Accept: "application/json" },
            next: { revalidate: 30 },
        });

        if (!res.ok) {
            throw new Error(`Public API trả về mã lỗi: ${res.status}`);
        }

        const json = await res.json();
        const items: User[] = (json.users || []).map((u: DummyUserResponse) => ({
            id: u.id,
            username: u.username,
            displayName: `${u.firstName} ${u.lastName}`,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone,
            avatar: u.image,
            image: u.image,
            role: u.role || (u.id % 3 === 0 ? "Admin" : u.id % 2 === 0 ? "Manager" : "User"),
            company: {
                name: 'Công ty Cổ phần ' + u.username,
                department: 'Khối Kỹ thuật & Công nghệ',
                title: u.role || 'Chuyên viên',
            },
            address: {
                city: 'TP. Hồ Chí Minh',
                country: 'Việt Nam',
            },
            status: u.age > 25 ? "Active" : "Pending",
            createdAt: new Date(Date.now() - u.id * 86400000).toISOString(),
        }));

        const totalItems = json.total || items.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return pagedSuccessResponse<User>(items, {
            pageIndex,
            pageSize,
            totalItems,
            totalPages,
        });
    } catch {
        // Fallback danh sách cố định nếu API công khai bên ngoài bị ngắt kết nối
        const fallbackUsers: User[] = [
            { id: 1, username: "nguyenvana", displayName: "Nguyễn Văn A", email: "vana@unimanage.vn", role: "Admin", status: "Active", createdAt: new Date().toISOString() },
            { id: 2, username: "tranthib", displayName: "Trần Thị B", email: "thib@unimanage.vn", role: "Manager", status: "Active", createdAt: new Date().toISOString() },
            { id: 3, username: "levanc", displayName: "Lê Văn C", email: "vanc@unimanage.vn", role: "User", status: "Pending", createdAt: new Date().toISOString() },
        ];

        return pagedSuccessResponse<User>(fallbackUsers, {
            pageIndex: 1,
            pageSize: 10,
            totalItems: fallbackUsers.length,
            totalPages: 1,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const newId = Date.now();
        return successResponse({ id: newId, ...body }, "Tạo người dùng mới thành công", 201);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Tạo người dùng thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        return successResponse({ deleted: body?.ids || [] }, "Xóa người dùng thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa người dùng thất bại";
        return errorResponse(message, [message], 400);
    }
}
