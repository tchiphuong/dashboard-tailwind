/**
 * Toast queue placeholder.
 * Hỗ trợ xếp hàng thông báo toast khi cần thiết.
 */
export const appToastQueue = {
    add: (toast: Record<string, unknown>) => {
        console.log("[Toast]", toast);
    },
    clear: () => {
        // Đã xóa danh sách toast
    },
};
