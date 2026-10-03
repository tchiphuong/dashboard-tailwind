import { apiClient } from "@/lib/api-client";
import { DASHBOARD_ENDPOINTS } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { DashboardOverviewData } from "@/types/dashboard.types";

export const DashboardService = {
    getOverview: async (): Promise<ApiResponse<DashboardOverviewData>> => {
        return apiClient.get<DashboardOverviewData>(DASHBOARD_ENDPOINTS.OVERVIEW);
    },
};

export type { DashboardOverviewData };
