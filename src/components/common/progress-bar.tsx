"use client";

import { Label, ProgressBar as HeroProgressBar } from "@heroui/react";
import React from "react";

export interface ProgressBarProps {
    value?: number;
    minValue?: number;
    maxValue?: number;
    label?: React.ReactNode;
    showValueLabel?: boolean;
    valueLabel?: string;
    size?: "sm" | "md" | "lg";
    color?: "default" | "accent" | "success" | "warning" | "danger";
    className?: string;
    "aria-label"?: string;
    children?: React.ReactNode;
}

/**
 * ProgressBar Component bọc chuẩn HeroUI v3 theo quy ước project
 */
export function ProgressBar({
    value = 0,
    minValue = 0,
    maxValue = 100,
    label,
    showValueLabel = false,
    valueLabel,
    size = "md",
    color = "accent",
    className,
    "aria-label": ariaLabel,
    children,
    ...props
}: Readonly<ProgressBarProps>) {
    // Nếu có children tùy biến (compound pattern)
    if (children) {
        return (
            <HeroProgressBar
                value={value}
                minValue={minValue}
                maxValue={maxValue}
                size={size}
                color={color}
                className={className}
                aria-label={ariaLabel || (typeof label === "string" ? label : "Tiến độ")}
                {...props}
            >
                {label && <Label>{label}</Label>}
                {children}
            </HeroProgressBar>
        );
    }

    return (
        <HeroProgressBar
            value={value}
            minValue={minValue}
            maxValue={maxValue}
            size={size}
            color={color}
            className={className}
            aria-label={ariaLabel || (typeof label === "string" ? label : "Tiến độ")}
            {...props}
        >
            {label && <Label>{label}</Label>}
            {showValueLabel && <HeroProgressBar.Output>{valueLabel || `${Math.round(value)}%`}</HeroProgressBar.Output>}
            <HeroProgressBar.Track>
                <HeroProgressBar.Fill />
            </HeroProgressBar.Track>
        </HeroProgressBar>
    );
}

ProgressBar.Track = HeroProgressBar.Track;
ProgressBar.Fill = HeroProgressBar.Fill;
ProgressBar.Output = HeroProgressBar.Output;

export type { ProgressBarProps as HeroProgressBarProps };
