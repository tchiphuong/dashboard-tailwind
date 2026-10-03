/**
 * Mock API Fallback Provider
 * Tự động fallback lấy dữ liệu từ free public API (DummyJSON / JSONPlaceholder)
 * hoặc mock chuẩn khi backend chưa chạy hoặc gặp lỗi kết nối.
 * Giúp Frontend hoạt động hoàn hảo 100%, sau này ráp Backend thật chỉ cần đổi NEXT_PUBLIC_API_BASE_URL.
 */

import { ApiResponse, PagedResult } from "@/types";

export async function handleMockFallback<T>(
    method: string,
    url: string,
    data?: any,
    params?: any,
): Promise<ApiResponse<T> | null> {
    const cleanUrl = url.toLowerCase();

    // 1. Auth Login Fallback
    if (cleanUrl.includes("/auth/login")) {
        return {
            returnCode: 0,
            message: "Success",
            errors: [],
            data: {
                accessToken: "mock-jwt-access-token-" + Date.now(),
                refreshToken: "mock-jwt-refresh-token-" + Date.now(),
                user: {
                    id: 1,
                    username: data?.username || "admin",
                    displayName: "Administrator",
                    email: "admin@unimanage.local",
                    role: "Admin",
                    avatar: "https://i.pravatar.cc/150?u=admin",
                },
            } as unknown as T,
        };
    }

    // 2. Auth Current User (Me) Fallback
    if (cleanUrl.includes("/auth/me")) {
        return {
            returnCode: 0,
            message: "Success",
            errors: [],
            data: {
                id: 1,
                username: "admin",
                displayName: "Administrator",
                email: "admin@unimanage.local",
                role: "Admin",
                avatar: "https://i.pravatar.cc/150?u=admin",
            } as unknown as T,
        };
    }

    // 3. Users List Fallback - Lấy từ DummyJSON users
    if (cleanUrl.includes("/users") && method.toLowerCase() === "get") {
        try {
            const pageIndex = Number(params?.pageIndex || 1);
            const pageSize = Number(params?.pageSize || 10);
            const skip = (pageIndex - 1) * pageSize;
            const search = params?.keyword ? `&q=${encodeURIComponent(params.keyword)}` : "";
            
            const res = await fetch(`https://dummyjson.com/users/search?limit=${pageSize}&skip=${skip}${search}`);
            if (res.ok) {
                const djData = await res.json();
                const items = djData.users.map((u: any) => ({
                    id: u.id,
                    username: u.username,
                    displayName: `${u.firstName} ${u.lastName}`,
                    email: u.email,
                    phone: u.phone,
                    avatar: u.image,
                    status: u.age > 30 ? "Active" : "Pending",
                    role: u.role || "User",
                    createdAt: "2024-01-15T00:00:00Z",
                }));

                const paged: PagedResult<any> = {
                    items,
                    paging: {
                        pageIndex,
                        pageSize,
                        totalItems: djData.total || items.length,
                        totalPages: Math.ceil((djData.total || items.length) / pageSize),
                    },
                };

                return {
                    returnCode: 0,
                    message: "Success",
                    errors: [],
                    data: paged as unknown as T,
                };
            }
        } catch {
            // Mạng offline, fallback mock tĩnh
        }

        return {
            returnCode: 0,
            message: "Success",
            errors: [],
            data: {
                items: [
                    { id: 1, username: "admin", displayName: "Admin User", email: "admin@example.com", status: "Active", createdAt: "2024-01-01" },
                    { id: 2, username: "john.doe", displayName: "John Doe", email: "john@example.com", status: "Active", createdAt: "2024-02-01" },
                    { id: 3, username: "sarah.smith", displayName: "Sarah Smith", email: "sarah@example.com", status: "Active", createdAt: "2024-03-01" },
                ],
                paging: { pageIndex: 1, pageSize: 10, totalItems: 3, totalPages: 1 },
            } as unknown as T,
        };
    }

    // 4. Roles List Fallback
    if (cleanUrl.includes("/roles") && method.toLowerCase() === "get") {
        const roles = [
            { id: 1, roleCode: "ADMIN", roleName: "Quản trị viên", description: "Toàn quyền hệ thống", userCount: 3, isSystem: true },
            { id: 2, roleCode: "MANAGER", roleName: "Quản lý phòng ban", description: "Duyệt đơn và xem báo cáo", userCount: 8, isSystem: false },
            { id: 3, roleCode: "EMPLOYEE", roleName: "Nhân viên", description: "Sử dụng tính năng cơ bản", userCount: 45, isSystem: false },
            { id: 4, roleCode: "HR", roleName: "Nhân sự", description: "Quản lý hồ sơ nhân viên", userCount: 5, isSystem: false },
        ];
        return {
            returnCode: 0,
            message: "Success",
            errors: [],
            data: {
                items: roles,
                paging: { pageIndex: 1, pageSize: 10, totalItems: roles.length, totalPages: 1 },
            } as unknown as T,
        };
    }

    // 5. Departments List Fallback
    if (cleanUrl.includes("/departments") && method.toLowerCase() === "get") {
        const depts = [
            { id: 1, departmentCode: "IT", departmentName: "Phòng Công nghệ thông tin", managerName: "Nguyễn Văn A", employeeCount: 15 },
            { id: 2, departmentCode: "HR", departmentName: "Phòng Hành chính Nhân sự", managerName: "Trần Thị B", employeeCount: 8 },
            { id: 3, departmentCode: "FIN", departmentName: "Phòng Kế toán Tài chính", managerName: "Lê Văn C", employeeCount: 6 },
            { id: 4, departmentCode: "SALES", departmentName: "Phòng Kinh doanh", managerName: "Phạm Văn D", employeeCount: 22 },
        ];
        return {
            returnCode: 0,
            message: "Success",
            errors: [],
            data: {
                items: depts,
                paging: { pageIndex: 1, pageSize: 10, totalItems: depts.length, totalPages: 1 },
            } as unknown as T,
        };
    }

    // 6. Todos List Fallback
    if (cleanUrl.includes("/todos") && method.toLowerCase() === "get") {
        try {
            const pageIndex = Number(params?.pageIndex || 1);
            const pageSize = Number(params?.pageSize || 10);
            const skip = (pageIndex - 1) * pageSize;
            const res = await fetch(`https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`);
            if (res.ok) {
                const djData = await res.json();
                return {
                    returnCode: 0,
                    message: "Success",
                    errors: [],
                    data: {
                        items: djData.todos,
                        paging: {
                            pageIndex,
                            pageSize,
                            totalItems: djData.total,
                            totalPages: Math.ceil(djData.total / pageSize),
                        },
                    } as unknown as T,
                };
            }
        } catch {
            // Offline fallback
        }
    }

    // 7. Quotes List & Random Fallback
    if (cleanUrl.includes("/quotes") && method.toLowerCase() === "get") {
        try {
            if (cleanUrl.includes("/random")) {
                const res = await fetch("https://dummyjson.com/quotes/random");
                if (res.ok) {
                    const quote = await res.json();
                    return {
                        returnCode: 0,
                        message: "Success",
                        errors: [],
                        data: quote as unknown as T,
                    };
                }
            }
            const pageIndex = Number(params?.pageIndex || 1);
            const pageSize = Number(params?.pageSize || 10);
            const skip = (pageIndex - 1) * pageSize;
            const res = await fetch(`https://dummyjson.com/quotes?limit=${pageSize}&skip=${skip}`);
            if (res.ok) {
                const djData = await res.json();
                return {
                    returnCode: 0,
                    message: "Success",
                    errors: [],
                    data: {
                        items: djData.quotes,
                        paging: {
                            pageIndex,
                            pageSize,
                            totalItems: djData.total,
                            totalPages: Math.ceil(djData.total / pageSize),
                        },
                    } as unknown as T,
                };
            }
        } catch {
            // Offline fallback
        }
    }

    // 8. Comments List Fallback
    if (cleanUrl.includes("/comments") && method.toLowerCase() === "get") {
        try {
            const pageIndex = Number(params?.pageIndex || 1);
            const pageSize = Number(params?.pageSize || 10);
            const skip = (pageIndex - 1) * pageSize;
            const res = await fetch(`https://dummyjson.com/comments?limit=${pageSize}&skip=${skip}`);
            if (res.ok) {
                const djData = await res.json();
                return {
                    returnCode: 0,
                    message: "Success",
                    errors: [],
                    data: {
                        items: djData.comments,
                        paging: {
                            pageIndex,
                            pageSize,
                            totalItems: djData.total,
                            totalPages: Math.ceil(djData.total / pageSize),
                        },
                    } as unknown as T,
                };
            }
        } catch {
            // Offline fallback
        }
    }

    // 9. J2Team Utility APIs Fallback (Vietnam Market Data)
    if (cleanUrl.includes("/utilities/")) {
        try {
            let j2Url = "";
            if (cleanUrl.includes("/currency")) j2Url = "https://apis.j2team.org/currency";
            else if (cleanUrl.includes("/gold")) j2Url = "https://apis.j2team.org/gold";
            else if (cleanUrl.includes("/petrol")) j2Url = "https://apis.j2team.org/petrol";
            else if (cleanUrl.includes("/banks")) j2Url = "https://apis.j2team.org/banks";

            if (j2Url) {
                const res = await fetch(j2Url);
                if (res.ok) {
                    const dataJson = await res.json();
                    return {
                        returnCode: 0,
                        message: "Success",
                        errors: [],
                        data: dataJson as unknown as T,
                    };
                }
            }
        } catch {
            // Offline fallback
        }
    }

    // 10. Generic Mutation (POST/PUT/DELETE) Fallback
    if (["post", "put", "delete", "patch"].includes(method.toLowerCase())) {
        return {
            returnCode: 0,
            message: "Success",
            errors: [],
            data: (data?.id || 1) as unknown as T,
        };
    }

    return null;
}
