/**
 * API Endpoints Constants
 * Centralized management of all API endpoints following RESTful conventions
 */

const API_VERSION = '/api/v1';

/**
 * Authentication & Authorization Endpoints
 */
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_VERSION}/auth/login`,
    REGISTER: `${API_VERSION}/auth/register`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    REFRESH_TOKEN: `${API_VERSION}/auth/refresh`,
    ME: `${API_VERSION}/auth/me`,
    CHANGE_PASSWORD: `${API_VERSION}/auth/change-password`,
    FORGOT_PASSWORD: `${API_VERSION}/auth/forgot-password`,
    RESET_PASSWORD: `${API_VERSION}/auth/reset-password`,
    PERMISSIONS: `${API_VERSION}/auth/permissions`,
    CHECK_USERNAME: (username: string) => `${API_VERSION}/auth/check-username/${username}`,
    CHECK_EMAIL: (email: string) => `${API_VERSION}/auth/check-email/${email}`,
} as const;

/**
 * User Management Endpoints
 */
export const USER_ENDPOINTS = {
    LIST: `${API_VERSION}/users`,
    DETAIL: (id: number | string) => `${API_VERSION}/users/${id}`,
    CREATE: `${API_VERSION}/users`,
    UPDATE: (id: number | string) => `${API_VERSION}/users/${id}`,
    DELETE: `${API_VERSION}/users`,
    COMBOBOX: `${API_VERSION}/users/combobox`,
    EXPORT: `${API_VERSION}/users/export`,
    IMPORT: `${API_VERSION}/users/import`,
} as const;

/**
 * Role Management Endpoints
 */
export const ROLE_ENDPOINTS = {
    LIST: `${API_VERSION}/roles`,
    DETAIL: (id: number | string) => `${API_VERSION}/roles/${id}`,
    CREATE: `${API_VERSION}/roles`,
    UPDATE: (id: number | string) => `${API_VERSION}/roles/${id}`,
    DELETE: `${API_VERSION}/roles`,
    COMBOBOX: `${API_VERSION}/roles/combobox`,
} as const;

/**
 * Department Management Endpoints
 */
export const DEPARTMENT_ENDPOINTS = {
    LIST: `${API_VERSION}/departments`,
    DETAIL: (id: number | string) => `${API_VERSION}/departments/${id}`,
    CREATE: `${API_VERSION}/departments`,
    UPDATE: (id: number | string) => `${API_VERSION}/departments/${id}`,
    DELETE: `${API_VERSION}/departments`,
    COMBOBOX: `${API_VERSION}/departments/combobox`,
} as const;

/**
 * Position Management Endpoints
 */
export const POSITION_ENDPOINTS = {
    LIST: `${API_VERSION}/positions`,
    DETAIL: (id: number | string) => `${API_VERSION}/positions/${id}`,
    CREATE: `${API_VERSION}/positions`,
    UPDATE: (id: number | string) => `${API_VERSION}/positions/${id}`,
    DELETE: `${API_VERSION}/positions`,
    COMBOBOX: `${API_VERSION}/positions/combobox`,
} as const;

/**
 * Product Management Endpoints
 */
export const PRODUCT_ENDPOINTS = {
    LIST: `${API_VERSION}/products`,
    DETAIL: (id: number | string) => `${API_VERSION}/products/${id}`,
    CREATE: `${API_VERSION}/products`,
    UPDATE: (id: number | string) => `${API_VERSION}/products/${id}`,
    DELETE: `${API_VERSION}/products`,
} as const;

/**
 * Dashboard & Analytics Endpoints
 */
export const DASHBOARD_ENDPOINTS = {
    OVERVIEW: `${API_VERSION}/dashboard/overview`,
    ANALYTICS: `${API_VERSION}/dashboard/analytics`,
    STATS: `${API_VERSION}/dashboard/stats`,
} as const;

/**
 * Todo Endpoints
 */
export const TODO_ENDPOINTS = {
    LIST: `${API_VERSION}/todos`,
    DETAIL: (id: number | string) => `${API_VERSION}/todos/${id}`,
    CREATE: `${API_VERSION}/todos`,
    UPDATE: (id: number | string) => `${API_VERSION}/todos/${id}`,
    DELETE: `${API_VERSION}/todos`,
} as const;

/**
 * Quote Endpoints
 */
export const QUOTE_ENDPOINTS = {
    LIST: `${API_VERSION}/quotes`,
    RANDOM: `${API_VERSION}/quotes/random`,
    DETAIL: (id: number | string) => `${API_VERSION}/quotes/${id}`,
} as const;

/**
 * Comment Endpoints
 */
export const COMMENT_ENDPOINTS = {
    LIST: `${API_VERSION}/comments`,
    DETAIL: (id: number | string) => `${API_VERSION}/comments/${id}`,
    CREATE: `${API_VERSION}/comments`,
} as const;

/**
 * Post & Content Endpoints (DummyJSON & J2Team Catalog)
 */
export const POST_ENDPOINTS = {
    LIST: `${API_VERSION}/posts`,
    DETAIL: (id: number | string) => `${API_VERSION}/posts/${id}`,
    CREATE: `${API_VERSION}/posts`,
    DELETE: `${API_VERSION}/posts`,
} as const;

/**
 * Audit Log Endpoints (Security & IP Geolocation)
 */
export const AUDIT_LOG_ENDPOINTS = {
    LIST: `${API_VERSION}/system/audit-logs`,
} as const;

/**
 * Notification Endpoints
 */
export const NOTIFICATION_ENDPOINTS = {
    LIST: `${API_VERSION}/system/notifications`,
    MARK_READ: (id: number | string) => `${API_VERSION}/system/notifications/${id}/read`,
    MARK_ALL_READ: `${API_VERSION}/system/notifications/mark-all-read`,
    DELETE: (id: number | string) => `${API_VERSION}/system/notifications/${id}`,
} as const;

/**
 * Asset Management Endpoints
 */
export const ASSET_ENDPOINTS = {
    LIST: `${API_VERSION}/assets`,
    DETAIL: (id: number | string) => `${API_VERSION}/assets/${id}`,
    CREATE: `${API_VERSION}/assets`,
    REQUESTS: `${API_VERSION}/assets/requests`,
    UPDATE_REQUEST: (id: number | string) => `${API_VERSION}/assets/requests/${id}`,
} as const;

/**
 * Project Management Endpoints
 */
export const PROJECT_ENDPOINTS = {
    LIST: `${API_VERSION}/projects`,
    DETAIL: (id: number | string) => `${API_VERSION}/projects/${id}`,
    CREATE: `${API_VERSION}/projects`,
    STATUSES: `${API_VERSION}/projects/statuses`,
} as const;

/**
 * Open Utilities Endpoints (J2Team APIs & Vietnam Data)
 */
export const UTILITY_ENDPOINTS = {
    CURRENCY: `${API_VERSION}/utilities/currency`,
    GOLD: `${API_VERSION}/utilities/gold`,
    PETROL: `${API_VERSION}/utilities/petrol`,
    BANKS: `${API_VERSION}/utilities/banks`,
    WEATHER: `${API_VERSION}/utilities/weather`,
} as const;

/**
 * System Endpoints
 */
export const SYSTEM_ENDPOINTS = {
    HEALTH: `${API_VERSION}/health`,
    VERSION: `${API_VERSION}/version`,
    NAVBAR: `${API_VERSION}/system/navbars`,
    SETTINGS: `${API_VERSION}/system/settings`,
    PROFILE: `${API_VERSION}/system/profile`,
} as const;

/**
 * Menu Endpoints
 */
export const MENU_ENDPOINTS = {
    LIST: `${API_VERSION}/menu`,
} as const;

/**
 * All API Endpoints
 */
export const API_ENDPOINTS = {
    AUTH: AUTH_ENDPOINTS,
    USER: USER_ENDPOINTS,
    ROLE: ROLE_ENDPOINTS,
    DEPARTMENT: DEPARTMENT_ENDPOINTS,
    POSITION: POSITION_ENDPOINTS,
    PRODUCT: PRODUCT_ENDPOINTS,
    DASHBOARD: DASHBOARD_ENDPOINTS,
    TODO: TODO_ENDPOINTS,
    QUOTE: QUOTE_ENDPOINTS,
    COMMENT: COMMENT_ENDPOINTS,
    UTILITY: UTILITY_ENDPOINTS,
    SYSTEM: SYSTEM_ENDPOINTS,
    MENU: MENU_ENDPOINTS,
    NOTIFICATION: NOTIFICATION_ENDPOINTS,
    ASSET: ASSET_ENDPOINTS,
    PROJECT: PROJECT_ENDPOINTS,
} as const;
