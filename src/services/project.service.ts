import { apiClient } from '@/lib/api-client';
import { PROJECT_ENDPOINTS } from '@/lib/api-endpoints';
import type {
    ProjectItem,
    ProjectListParams,
    CreateProjectDto,
    ProjectStatusOption,
    ApiResponse,
    PagedResponse,
    PagedResult,
} from '@/types';

export const ProjectService = {
    /**
     * Lấy danh sách dự án có phân trang và bộ lọc
     */
    async getProjects(params?: ProjectListParams): Promise<PagedResponse<ProjectItem>> {
        return apiClient.get<PagedResult<ProjectItem>>(PROJECT_ENDPOINTS.LIST, {
            params,
        });
    },

    /**
     * Lấy danh mục trạng thái dự án cho combobox / filter
     */
    async getStatuses(): Promise<ApiResponse<ProjectStatusOption[]>> {
        return apiClient.get<ProjectStatusOption[]>(PROJECT_ENDPOINTS.STATUSES);
    },

    /**
     * Khởi tạo dự án mới
     */
    async createProject(data: CreateProjectDto): Promise<ApiResponse<ProjectItem>> {
        return apiClient.post<ProjectItem>(PROJECT_ENDPOINTS.CREATE, data);
    },
};
