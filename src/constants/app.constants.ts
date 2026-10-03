/**
 * Global configuration constants for the entire application
 */
export const APP_CONSTANTS = {
    // Default pagination settings
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 20,
        PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    },

    // Standard date formats (for use with date-fns, dayjs)
    DATE_FORMATS: {
        DATE_ONLY: "DD/MM/YYYY",
        DATETIME: "DD/MM/YYYY HH:mm",
        DATETIME_WITH_SECONDS: "DD/MM/YYYY HH:mm:ss",
        ISO: "YYYY-MM-DDTHH:mm:ss[Z]", // Format for sending to backend API
    },

    // File upload limits and types
    UPLOAD: {
        MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
        MAX_DOCUMENT_SIZE: 20 * 1024 * 1024, // 20MB
        ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
        ACCEPTED_DOC_TYPES: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        ],
    },

    // LocalStorage and SessionStorage keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: "access_token",
        REFRESH_TOKEN: "refresh_token",
        USER_INFO: "user_info",
        THEME: "theme",
        LANGUAGE: "language",
        SIDEBAR_COLLAPSED: "sidebar_collapsed",
    },

    // Common regular expressions for form validation
    REGEX: {
        // Standard email format
        EMAIL: /^[A-Z\d._%+-]+@[A-Z\d.-]+\.[A-Z]{2,4}$/i,
        // Vietnam phone numbers (starting with 03, 05, 07, 08, 09)
        VN_PHONE: /(03|05|07|08|09|01[2689])+(\d{8})\b/,
        // Strong password: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        // Alphanumeric only, no spaces
        ALPHANUMERIC: /^[a-zA-Z\d]+$/,
    },

    // Default timings for UI interactions (ms)
    TIMINGS: {
        DEBOUNCE_SEARCH: 500,
        TOAST_DURATION: 3000,
        MODAL_TRANSITION: 200,
    },
};
