"use client";

import { useRouter } from "next/navigation";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";

import {
    clearAuthCookies,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "@/lib/cookies";
import {
    authService,
    type CurrentUserResponse,
} from "@/services/auth.service";

interface AuthContextType {
    user: CurrentUserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (
        accessToken: string,
        refreshToken: string,
        user: CurrentUserResponse,
    ) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
    const [user, setUser] = useState<CurrentUserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = getAccessToken();
            if (!token) {
                setUser(null);
                return;
            }

            // Decode JWT to get username (simple base64 decode of payload)
            const payload = JSON.parse(atob(token.split(".")[1]));
            const username = payload.sub || payload.username;

            if (!username) {
                throw new Error("Username not found in token");
            }

            const response = await authService.getCurrentUser(username);
            if (response.returnCode === 0 && response.data) {
                setUser(response.data);
                localStorage.setItem(
                    "auth_user",
                    JSON.stringify(response.data),
                );
            } else {
                clearAuthCookies();
                localStorage.removeItem("auth_user");
                setUser(null);
            }
        } catch (error) {
            console.error("Refresh user error:", error);
            clearAuthCookies();
            localStorage.removeItem("auth_user");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initialize auth state from cookies
    useEffect(() => {
        const initAuth = async () => {
            const token = getAccessToken();
            if (token) {
                const cachedUser = localStorage.getItem("auth_user");
                if (cachedUser) {
                    try {
                        setUser(JSON.parse(cachedUser));
                        setIsLoading(false);
                        return; // Skip API call since we have cached user
                    } catch {
                        localStorage.removeItem("auth_user");
                    }
                }
                await refreshUser();
            } else {
                setIsLoading(false);
            }
        };

        void initAuth();
    }, [refreshUser]);

    const login = useCallback(
        (
            accessToken: string,
            refreshToken: string,
            userData: CurrentUserResponse,
        ) => {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUser(userData);
            localStorage.setItem("auth_user", JSON.stringify(userData));
        },
        [],
    );

    const logout = useCallback(async () => {
        try {
            const refreshTokenValue = getRefreshToken();
            if (refreshTokenValue) {
                await authService.logout(refreshTokenValue);
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            clearAuthCookies();
            localStorage.removeItem("auth_user");
            setUser(null);
            router.push("/auth/login");
        }
    }, [router]);

    const value: AuthContextType = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            refreshUser,
        }),
        [user, isLoading, login, logout, refreshUser],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
