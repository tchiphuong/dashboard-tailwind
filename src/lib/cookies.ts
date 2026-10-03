import Cookies from "js-cookie";

/**
 * Cookie helper utilities
 */

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Cookie options
const cookieOptions = {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax" as const,
};

const shortCookieOptions = {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
};

/**
 * Save access token to cookie
 */
export function setAccessToken(
    token: string,
    rememberMe: boolean = false,
): void {
    Cookies.set(
        TOKEN_KEY,
        token,
        rememberMe ? cookieOptions : shortCookieOptions,
    );
}

/**
 * Get access token from cookie
 */
export function getAccessToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
}

/**
 * Remove access token from cookie
 */
export function removeAccessToken(): void {
    Cookies.remove(TOKEN_KEY);
}

/**
 * Save refresh token to cookie
 */
export function setRefreshToken(
    token: string,
    rememberMe: boolean = false,
): void {
    Cookies.set(
        REFRESH_TOKEN_KEY,
        token,
        rememberMe ? cookieOptions : shortCookieOptions,
    );
}

/**
 * Get refresh token from cookie
 */
export function getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_KEY);
}

/**
 * Remove refresh token from cookie
 */
export function removeRefreshToken(): void {
    Cookies.remove(REFRESH_TOKEN_KEY);
}

/**
 * Remove all auth cookies
 */
export function clearAuthCookies(): void {
    removeAccessToken();
    removeRefreshToken();
}

/**
 * Check if user is authenticated (has valid token in cookie)
 */
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}
