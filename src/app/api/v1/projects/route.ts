import { NextRequest } from "next/server";
import { pagedSuccessResponse, successResponse, errorResponse } from "@/lib/api-response-helper";
import type { ProjectItem, CreateProjectDto } from "@/types";

interface DummyTodo {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

let customProjects: ProjectItem[] = [];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
    const skip = (pageIndex - 1) * pageSize;
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    try {
        // Tận dụng Public API DummyJSON Todos từ kho 1.563 Public APIs apis.j2team.org
        const fetchUrl = `https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`;
        const res = await fetch(fetchUrl, {
            headers: { Accept: "application/json" },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Lỗi public todos API: ${res.status}`);
        }

        const json = await res.json();
        const rawTodos: DummyTodo[] = json.todos || [];

        const leaders = ["Nguyễn Văn Hùng", "Phạm Đức Trọng", "Trần Minh Tâm", "Lê Thị Thu Thảo", "Hoàng Kim Oanh"];
        const projectNames = [
            "Nâng cấp Hệ thống ERP & Quản trị Bán hàng Đa kênh",
            "Tích hợp Cổng thanh toán VietQR & Đối soát Ngân hàng",
            "Tự động hóa Quy trình Quản lý Kho vận & Tracking Logistics",
            "Xây dựng Cổng Dịch vụ Khách hàng Trực tuyến Portal 2.0",
            "Số hóa Hồ sơ Nhân sự & Đánh giá KPI Tự động hóa",
            "Triển khai Nền tảng Phân tích Dữ liệu BI & AI Dashboard",
            "Bảo mật Hệ thống & Chuẩn hóa Chứng chỉ ISO 27001",
            "Hệ thống Quản lý Chuỗi Cung ứng & Đặt hàng Tự động",
        ];

        const items: ProjectItem[] = rawTodos.map((t, idx) => {
            const isDone = t.completed;
            const progress = isDone ? 100 : Math.min(95, (t.id * 17) % 90 + 10);
            let status: ProjectItem['status'] = 'in_progress';
            if (isDone) status = 'completed';
            else if (progress < 25) status = 'planning';
            // else: giữ nguyên 'in_progress' mặc định

            const projectName = projectNames[(t.id - 1) % projectNames.length] + (t.id > 8 ? ` (Giai đoạn ${Math.floor(t.id / 8) + 1})` : '');

            return {
                id: `proj-${t.id}`,
                code: `PRJ-2026-${String(t.id).padStart(2, '0')}`,
                name: projectName,
                leader: leaders[(t.userId || idx) % leaders.length],
                budget: (t.id * 35000000) % 500000000 + 120000000,
                progress,
                startDate: `2026-0${(t.id % 6) + 1}-01`,
                endDate: `2026-1${(t.id % 2) + 1}-28`,
                status,
                teamSize: (t.id % 8) + 4,
                description: t.todo,
                createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 7).toISOString(),
            };
        });

        const combined = [...customProjects, ...items];
        let filtered = combined;

        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }
        if (search) {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search));
        }

        const totalItems = (json.total || items.length) + customProjects.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return pagedSuccessResponse<ProjectItem>(filtered, {
            pageIndex,
            pageSize,
            totalItems,
            totalPages,
        });
    } catch {
        // Mock fallback an toàn theo rule khi mạng offline hoặc API ngoài gặp sự cố
        const fallbackProjects: ProjectItem[] = [
            {
                id: 'proj-1',
                code: 'PRJ-2026-01',
                name: 'Nâng cấp Hệ thống ERP & Quản trị Bán hàng Đa kênh',
                leader: 'Nguyễn Văn Hùng',
                budget: 450000000,
                progress: 78,
                startDate: '2026-06-01',
                endDate: '2026-10-30',
                status: 'in_progress',
                teamSize: 12,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'proj-2',
                code: 'PRJ-2026-02',
                name: 'Tích hợp Cổng thanh toán VietQR & Đối soát Ngân hàng',
                leader: 'Phạm Đức Trọng',
                budget: 180000000,
                progress: 100,
                startDate: '2026-08-01',
                endDate: '2026-09-20',
                status: 'completed',
                teamSize: 6,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'proj-3',
                code: 'PRJ-2026-03',
                name: 'Tự động hóa Quy trình Quản lý Kho vận & Tracking Logistics',
                leader: 'Trần Minh Tâm',
                budget: 320000000,
                progress: 42,
                startDate: '2026-07-15',
                endDate: '2026-12-15',
                status: 'in_progress',
                teamSize: 8,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'proj-4',
                code: 'PRJ-2026-04',
                name: 'Xây dựng Cổng Dịch vụ Khách hàng Trực tuyến Portal 2.0',
                leader: 'Lê Thị Thu Thảo',
                budget: 210000000,
                progress: 15,
                startDate: '2026-09-01',
                endDate: '2027-01-30',
                status: 'planning',
                teamSize: 5,
                createdAt: new Date().toISOString(),
            },
        ];

        let filtered = [...customProjects, ...fallbackProjects];
        if (search) {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search));
        }
        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        return pagedSuccessResponse<ProjectItem>(filtered, {
            pageIndex,
            pageSize,
            totalItems: filtered.length,
            totalPages: Math.ceil(filtered.length / pageSize),
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: CreateProjectDto = await req.json();

        if (!body.name || !body.code || !body.leader) {
            return errorResponse("Vui lòng điền đầy đủ mã dự án, tên dự án và người phụ trách", 400);
        }

        const newProject: ProjectItem = {
            id: `proj-${Date.now()}`,
            code: body.code.toUpperCase(),
            name: body.name,
            leader: body.leader,
            budget: Number(body.budget) || 0,
            progress: Number(body.progress) || 0,
            startDate: body.startDate || new Date().toISOString().slice(0, 10),
            endDate: body.endDate || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
            status: body.status || 'planning',
            description: body.description,
            createdAt: new Date().toISOString(),
        };

        customProjects = [newProject, ...customProjects];

        return successResponse(newProject, "Khởi tạo dự án mới thành công", 201);
    } catch {
        return errorResponse("Dữ liệu đầu vào không hợp lệ", 400);
    }
}
