import { apiClient } from "@/lib/api-client";
import { AUDIT_LOG_ENDPOINTS } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { AuditLogItem, AuditLogListParams } from "@/types/audit-log.types";

export const AuditLogService = {
    list: async (params?: AuditLogListParams): Promise<ApiResponse<AuditLogItem[]>> => {
        const response = await apiClient.get<AuditLogItem[]>(AUDIT_LOG_ENDPOINTS.LIST, {
            params,
        });
        return response;
    },
};

export type { AuditLogItem, AuditLogListParams };
