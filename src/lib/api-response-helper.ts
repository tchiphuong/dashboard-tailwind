import { NextResponse } from "next/server";

import type { ApiResponse, PagedResult, PagingInfo } from "@/types";

/**
 * Helper tạo phản hồi HTTP theo đúng chuẩn ApiResponse của UniManage
 */
export function successResponse<T>(
    data: T,
    message: string = "Thành công",
    status: number = 200,
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            returnCode: 0,
            message,
            data,
            errors: [],
        },
        { status },
    );
}

/**
 * Helper tạo phản hồi HTTP phân trang theo đúng chuẩn PagedResponse
 */
export function pagedSuccessResponse<T>(
    items: T[],
    paging: PagingInfo,
    message: string = "Lấy danh sách thành công",
): NextResponse<ApiResponse<PagedResult<T>>> {
    return NextResponse.json(
        {
            returnCode: 0,
            message,
            data: {
                items,
                paging,
            },
            errors: [],
        },
        { status: 200 },
    );
}

/**
 * Helper tạo phản hồi lỗi
 */
export function errorResponse(
    message: string = "Có lỗi xảy ra",
    errorsOrStatus: string[] | number = [],
    status: number = 400,
): NextResponse<ApiResponse<null>> {
    const finalErrors = Array.isArray(errorsOrStatus) ? errorsOrStatus : [];
    const finalStatus = typeof errorsOrStatus === "number" ? errorsOrStatus : status;

    return NextResponse.json(
        {
            returnCode: finalStatus,
            message,
            data: null,
            errors: finalErrors,
        },
        { status: finalStatus },
    );
}
