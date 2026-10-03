"use client";

import { Description, Switch as HeroSwitch } from "@heroui/react";

interface SwitchProps {
    isSelected?: boolean;
    defaultSelected?: boolean;
    onChange?: (isSelected: boolean) => void;
    label?: string;
    description?: string;
    isDisabled?: boolean;
    size?: "sm" | "md" | "lg";
    name?: string;
    className?: string;
}

/**
 * Switch Component chuẩn hóa
 * Wrapper HeroUI v3 Switch với compound pattern
 * Default: size="md"
 */
export function Switch({
    isSelected,
    defaultSelected,
    onChange,
    label,
    description,
    isDisabled = false,
    size = "md",
    name,
    className = "",
}: Readonly<SwitchProps>) {
    return (
        <HeroSwitch
            isSelected={isSelected}
            defaultSelected={defaultSelected}
            onChange={onChange}
            isDisabled={isDisabled}
            size={size}
            name={name}
            className={className}
        >
            <HeroSwitch.Content>
                <HeroSwitch.Control>
                    <HeroSwitch.Thumb />
                </HeroSwitch.Control>
                {label}
            </HeroSwitch.Content>
            {description && <Description>{description}</Description>}
        </HeroSwitch>
    );
}
