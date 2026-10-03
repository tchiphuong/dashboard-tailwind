"use client";

import { Button } from "@heroui/react";

import { LanguageSwitcher } from "./language-switcher";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    showLanguageSwitcher?: boolean;
}

/**
 * Component header chuẩn cho các trang với i18n support
 */
export function PageHeaderI18n({
    title,
    description,
    action,
    showLanguageSwitcher = false,
}: PageHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-4">
                {showLanguageSwitcher && <LanguageSwitcher />}
                {action && (
                    <Button onPress={action.onClick}>{action.label}</Button>
                )}
            </div>
        </div>
    );
}

export { PageHeaderI18n as PageHeader };
