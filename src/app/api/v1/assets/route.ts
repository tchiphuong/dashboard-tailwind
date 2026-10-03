import { NextRequest } from "next/server";
import { pagedSuccessResponse, successResponse, errorResponse } from "@/lib/api-response-helper";
import type { AssetItem, CreateAssetDto } from "@/types";

interface DummyProduct {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    brand?: string;
    thumbnail?: string;
}

// Bộ nhớ tạm trong phiên làm việc để lưu tài sản mới thêm
let customAssets: AssetItem[] = [];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
    const skip = (pageIndex - 1) * pageSize;
    const categoryFilter = searchParams.get("category");
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    try {
        // Tận dụng Public API DummyJSON (Laptops & Mobile Accessories) từ danh mục 1.563 Public APIs apis.j2team.org
        const targetCategory = categoryFilter === 'office' ? 'mobile-accessories' : 'laptops';
        const fetchUrl = search
            ? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${pageSize}&skip=${skip}`
            : `https://dummyjson.com/products/category/${targetCategory}?limit=${pageSize}&skip=${skip}`;

        const res = await fetch(fetchUrl, {
            headers: { Accept: "application/json" },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Lỗi public products API: ${res.status}`);
        }

        const json = await res.json();
        const rawProducts: DummyProduct[] = json.products || [];

        const departments = ["Khối Kỹ thuật IT", "Khối Kinh doanh", "Phòng Tài chính Kế toán", "Phòng Nhân sự HR", "Ban Giám Đốc"];
        const assignees = ["Phạm Đức Trọng", "Trần Minh Tâm", "Lê Thị Thu Thảo", "Hoàng Kim Oanh", "Nguyễn Văn Hùng"];
        const statuses: ('in_use' | 'available' | 'maintenance')[] = ['in_use', 'available', 'in_use', 'maintenance', 'in_use'];

        const items: AssetItem[] = rawProducts.map((p, idx) => ({
            id: `ast-${p.id}`,
            code: `AST-${(p.brand || 'IT').toUpperCase().replace(/[^A-Z0-9]/g, '')}-${String(p.id).padStart(4, '0')}`,
            name: p.title,
            category: p.category === 'laptops' ? 'Thiết bị IT' : 'Thiết bị văn phòng',
            assignedTo: idx % 3 === 1 ? 'Chưa cấp phát (Kho IT)' : assignees[idx % assignees.length],
            department: idx % 3 === 1 ? 'Kho IT' : departments[idx % departments.length],
            value: Math.round(p.price * 25400), // Quy đổi tỷ giá USD -> VNĐ chuẩn thực tế
            status: idx % 3 === 1 ? 'available' : statuses[idx % statuses.length],
            brand: p.brand || 'Enterprise',
            thumbnail: p.thumbnail,
            createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
        }));

        // Gộp các tài sản do người dùng vừa tạo trong phiên
        const combined = [...customAssets, ...items];
        let filtered = combined;

        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        const totalItems = (json.total || items.length) + customAssets.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return pagedSuccessResponse<AssetItem>(filtered, {
            pageIndex,
            pageSize,
            totalItems,
            totalPages,
        });
    } catch {
        // Mock fallback an toàn theo rule khi mạng offline hoặc API ngoài gặp sự cố
        const fallbackAssets: AssetItem[] = [
            {
                id: 'ast-1',
                code: 'AST-APPLE-0102',
                name: 'MacBook Pro 14" M3 Pro (18GB/512GB)',
                category: 'Thiết bị IT',
                assignedTo: 'Phạm Đức Trọng',
                department: 'Khối Kỹ thuật IT',
                value: 49990000,
                status: 'in_use',
                brand: 'Apple',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'ast-2',
                code: 'AST-DELL-0089',
                name: 'Màn hình Dell UltraSharp 27" 4K (U2723QE)',
                category: 'Thiết bị IT',
                assignedTo: 'Trần Minh Tâm',
                department: 'Khối Kinh doanh',
                value: 12500000,
                status: 'in_use',
                brand: 'Dell',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'ast-3',
                code: 'AST-DELL-0098',
                name: 'Laptop Dell XPS 15 (i7/32GB/1TB)',
                category: 'Thiết bị IT',
                assignedTo: 'Chưa cấp phát (Kho IT)',
                department: 'Kho IT',
                value: 38000000,
                status: 'available',
                brand: 'Dell',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'ast-4',
                code: 'AST-CANON-0012',
                name: 'Máy in laser đa năng Canon MF244dw',
                category: 'Thiết bị văn phòng',
                assignedTo: 'Lê Thị Thu Thảo',
                department: 'Phòng Tài chính Kế toán',
                value: 6800000,
                status: 'maintenance',
                brand: 'Canon',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'ast-5',
                code: 'AST-LENOVO-0055',
                name: 'Lenovo ThinkPad X1 Carbon Gen 11',
                category: 'Thiết bị IT',
                assignedTo: 'Nguyễn Văn Hùng',
                department: 'Ban Giám Đốc',
                value: 42000000,
                status: 'in_use',
                brand: 'Lenovo',
                createdAt: new Date().toISOString(),
            },
        ];

        let filtered = [...customAssets, ...fallbackAssets];
        if (search) {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search));
        }
        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        return pagedSuccessResponse<AssetItem>(filtered, {
            pageIndex,
            pageSize,
            totalItems: filtered.length,
            totalPages: Math.ceil(filtered.length / pageSize),
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: CreateAssetDto = await req.json();

        if (!body.name || !body.code || !body.value) {
            return errorResponse("Vui lòng điền đầy đủ mã, tên và giá trị tài sản", 400);
        }

        const newAsset: AssetItem = {
            id: `ast-${Date.now()}`,
            code: body.code.toUpperCase(),
            name: body.name,
            category: body.category || 'Thiết bị IT',
            assignedTo: body.assignedTo || 'Chưa cấp phát (Kho IT)',
            department: body.department || 'Kho IT',
            value: Number(body.value),
            status: body.status || 'available',
            createdAt: new Date().toISOString(),
        };

        customAssets = [newAsset, ...customAssets];

        return successResponse(newAsset, "Thêm mới tài sản thành công", 201);
    } catch {
        return errorResponse("Dữ liệu đầu vào không hợp lệ", 400);
    }
}
