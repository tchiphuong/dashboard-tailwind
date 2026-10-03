"use client";

import {
    ArrowRightStartOnRectangleIcon,
    BellIcon,
    Cog6ToothIcon,
    MoonIcon,
    SunIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Button, Dropdown } from "@/components/common";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useNavbarContext } from "@/contexts/navbar-context";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { Notification } from "@/types";

export function Header() {
    const t = useTranslations();
    const { setTheme, resolvedTheme } = useTheme();
    const darkMode = resolvedTheme === "dark";
    const toggleDarkMode = () => setTheme(darkMode ? "light" : "dark");
    const { navbarOpen, toggleNavbar } = useNavbarContext();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Placeholder for notifications until real API is ready
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const markAllAsRead = () => {
        setNotifications([]);
    };

    // User menu handlers
    const handleProfile = () => {
        navigate("/profile");
    };

    const handleSettings = () => {
        navigate("/settings");
    };

    const handleSignOut = async () => {
        await logout();
    };

    const renderThemeIcon = () => {
        if (!mounted) return <div className="h-6 w-6" />;
        if (darkMode) {
            return <SunIcon className="h-6 w-6 text-yellow-500" />;
        }
        return <MoonIcon className="h-6 w-6 text-blue-500" />;
    };

    return (
        <header className="bg-surface text-surface-foreground z-50 h-16 shadow-md transition-colors duration-300">
            <div className="mx-auto h-full px-4">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Hamburger/X button */}
                        <button
                            onClick={toggleNavbar}
                            className="text-muted hover:text-foreground relative h-8 w-8 cursor-pointer transition-colors focus:outline-none"
                        >
                            <span
                                className={`absolute block h-0.5 transform rounded-full bg-current transition-all duration-300 ease-in-out ${
                                    navbarOpen
                                        ? "top-3.5 w-6 rotate-45"
                                        : "top-2 w-5"
                                }`}
                            />
                            <span
                                className={`absolute block h-0.5 rounded-full bg-current transition-all duration-300 ease-in-out ${
                                    navbarOpen ? "w-6 opacity-0" : "top-4 w-5"
                                }`}
                            />
                            <span
                                className={`absolute block h-0.5 transform rounded-full bg-current transition-all duration-300 ease-in-out ${
                                    navbarOpen
                                        ? "top-3.5 w-6 -rotate-45"
                                        : "top-6 w-5"
                                }`}
                            />
                        </button>

                        <img
                            src="/imgs/logo-horizontal.png"
                            alt="UniManage Logo"
                            className="h-8 max-w-32 object-contain"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Dark mode toggle */}
                        <Button
                            isIconOnly
                            variant="ghost"
                            onClick={toggleDarkMode}
                            className="text-muted hover:text-foreground rounded-full"
                        >
                            {renderThemeIcon()}
                        </Button>

                        {/* Notification Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <div className="text-muted hover:text-foreground relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-visible rounded-full focus:outline-none">
                                    <BellIcon className="h-6 w-6 text-current" />
                                    {notifications.length > 0 && (
                                        <span className="bg-danger-500 absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm">
                                            {notifications.length > 99
                                                ? "99+"
                                                : notifications.length}
                                        </span>
                                    )}
                                </div>
                            </Dropdown.Trigger>
                            <Dropdown.Popover placement="bottom end">
                                <Dropdown.Menu
                                    aria-label="Notifications"
                                    className="w-80 gap-4"
                                >
                                    <Dropdown.Item
                                        key="header"
                                        className="h-10 gap-2 opacity-100"
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            <span className="text-foreground text-sm font-semibold">
                                                {t(
                                                    "common.notifications",
                                                )}
                                            </span>
                                            <span className="text-muted text-xs">
                                                {t(
                                                    "common.unreadNotifications",
                                                    {
                                                        count: notifications.length,
                                                    },
                                                )}
                                            </span>
                                        </div>
                                    </Dropdown.Item>

                                    {notifications.length === 0 ? (
                                        <Dropdown.Item
                                            key="empty"
                                            className="text-muted py-4 text-center"
                                        >
                                            {t("common.noResults")}
                                        </Dropdown.Item>
                                    ) : (
                                        notifications
                                            .slice(0, 5)
                                            .map((notification) => (
                                                <Dropdown.Item
                                                    key={notification.id}
                                                    textValue={
                                                        notification.name
                                                    }
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <p className="line-clamp-1 text-sm font-medium">
                                                            {notification.name}
                                                        </p>
                                                        <p className="text-muted line-clamp-1 text-xs italic">
                                                            {notification.email}
                                                        </p>
                                                        <p className="text-muted line-clamp-2 text-xs">
                                                            {notification.body}
                                                        </p>
                                                    </div>
                                                </Dropdown.Item>
                                            ))
                                    )}

                                    <Dropdown.Item
                                        key="mark-all"
                                        className="text-accent text-center font-medium"
                                        onPress={markAllAsRead}
                                    >
                                        {t("common.markAllAsRead")}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>

                        {/* User Profile Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <div className="hover:bg-default flex h-auto cursor-pointer items-center gap-2 rounded-lg p-1 transition-colors focus:outline-none">
                                    <Avatar
                                        className="ring-accent ring-2"
                                        color="accent"
                                        size="sm"
                                    >
                                        <Avatar.Image
                                            src=""
                                            alt={
                                                user?.displayName ||
                                                user?.userCode ||
                                                t("common.profile")
                                            }
                                        />
                                        <Avatar.Fallback>
                                            {user?.displayName?.[0] ||
                                                user?.userCode?.[0]?.toUpperCase() ||
                                                t("common.profile")[0]}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    <div className="hidden flex-col items-start sm:flex">
                                        <span className="text-foreground line-clamp-1 text-left text-sm font-medium">
                                            {user?.displayName ||
                                                user?.userCode ||
                                                t("common.loading")}
                                        </span>
                                        <span className="text-muted line-clamp-1 text-left text-xs">
                                            {user
                                                ? user.email ||
                                                  user.roleCode ||
                                                  "â€”"
                                                : t(
                                                      "common.loading",
                                                  )}
                                        </span>
                                    </div>
                                </div>
                            </Dropdown.Trigger>
                            <Dropdown.Popover placement="bottom end">
                                <Dropdown.Menu aria-label="Profile Actions">
                                    <Dropdown.Item
                                        key="profile_info"
                                        className="h-14 gap-2 opacity-100 sm:hidden"
                                    >
                                        <p className="font-semibold">
                                            {user?.displayName ||
                                                user?.userCode ||
                                                t("common.loading")}
                                        </p>
                                        <p className="text-muted text-xs">
                                            {user
                                                ? user.email ||
                                                  user.roleCode ||
                                                  "â€”"
                                                : t(
                                                      "common.loading",
                                                  )}
                                        </p>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        key="profile"
                                        textValue={t(
                                            "common.global.lbl.profile",
                                        )}
                                        onPress={handleProfile}
                                    >
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-5 w-5 text-current" />
                                            <span>
                                                {t("common.global.lbl.profile")}
                                            </span>
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        key="settings"
                                        textValue={t(
                                            "common.menu.lbl.settings",
                                        )}
                                        onPress={handleSettings}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Cog6ToothIcon className="h-5 w-5 text-current" />
                                            <span>
                                                {t("common.menu.lbl.settings")}
                                            </span>
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        key="logout"
                                        variant="danger"
                                        textValue={t(
                                            "common.global.btn.signOut",
                                        )}
                                        onPress={handleSignOut}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-current" />
                                            <span>
                                                {t("common.signOut")}
                                            </span>
                                        </div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
}

