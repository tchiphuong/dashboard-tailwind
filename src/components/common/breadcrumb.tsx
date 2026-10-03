"use client";

import { Breadcrumbs as HeroBreadcrumbs } from "@heroui/react";
import React from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    children?: React.ReactNode;
    className?: string;
}

/**
 * Breadcrumb Component chuẩn hóa HeroUI v3 thuần túy
 * Hỗ trợ cả 2 dạng:
 * 1. Truyền mảng `items`: <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }]} />
 * 2. Compound pattern: <Breadcrumb><Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item></Breadcrumb>
 */
export function Breadcrumb({ items, children, className }: Readonly<BreadcrumbProps>) {
    if (children) {
        return (
            <HeroBreadcrumbs className={className}>
                {children}
            </HeroBreadcrumbs>
        );
    }

    if (!items || items.length === 0) return null;

    return (
        <HeroBreadcrumbs className={className}>
            {items.map((item, index) => {
                const itemProps = item.href ? { href: item.href } : {};
                return (
                    <HeroBreadcrumbs.Item
                        key={`${item.label}-${index}`}
                        {...itemProps}
                    >
                        {item.label}
                    </HeroBreadcrumbs.Item>
                );
            })}
        </HeroBreadcrumbs>
    );
}

Breadcrumb.Item = HeroBreadcrumbs.Item;

export { HeroBreadcrumbs as Breadcrumbs };
