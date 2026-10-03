"use client";

import { Dropdown } from "@/components/common";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { Key } from "react";

import type { Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
    className?: string;
}

export function LanguageSwitcher({
    className = "",
}: Readonly<LanguageSwitcherProps>) {
    const t = useTranslations("common.global.lbl");
    const locale = useLocale() as Locale;

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSelectionChange = (key: Key | Key[] | null) => {
        const newLocale = key as Locale;
        if (!newLocale || newLocale === locale) return;

        // Set cookie so server-side i18n can pick the selected locale on next request
        Cookies.set("locale", newLocale, { expires: 365 });

        // Reload the page so server picks up new locale from cookie
        // Use location.assign to perform a full reload
        if (typeof window !== "undefined") {
            const params = searchParams.toString();
            const fullPath = params ? `${pathname}?${params}` : pathname;
            window.location.assign(fullPath);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Dropdown>
                <Dropdown.Trigger>
                    <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm font-medium opacity-80 transition-opacity hover:opacity-100 focus:outline-none">
                        <Icon
                            icon={`circle-flags:${locale === "vi" ? "vn" : "us"}`}
                            className="text-xl"
                        />
                        <span>
                            {locale === "vi"
                                ? t("languageVietnamese")
                                : t("languageEnglish")}
                        </span>
                    </div>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                    <Dropdown.Menu
                        aria-label={t("languageSelect")}
                        onAction={(key) => handleSelectionChange(key)}
                        selectedKeys={new Set([locale])}
                        selectionMode="single"
                    >
                        <Dropdown.Item
                            key="vi"
                            textValue={t("languageVietnamese")}
                        >
                            <div className="flex items-center gap-2">
                                <Icon
                                    icon="circle-flags:vn"
                                    className="text-xl"
                                />
                                <span>{t("languageVietnamese")}</span>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                            key="en"
                            textValue={t("languageEnglish")}
                        >
                            <div className="flex items-center gap-2">
                                <Icon
                                    icon="circle-flags:us"
                                    className="text-xl"
                                />
                                <span>{t("languageEnglish")}</span>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </div>
    );
}
