/**
 * Authentication Models
 */

export interface LoginRequest {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: UserInfo;
}

export interface UserInfo {
    id: number;
    userCode: string;
    displayName: string;
    email?: string;
    roleCode?: string;
}

export interface UserProfile {
    id: number;
    userCode: string;
    displayName: string;
    email?: string;
    phoneNumber?: string;
    status: number;
    roleCode?: string;
}
