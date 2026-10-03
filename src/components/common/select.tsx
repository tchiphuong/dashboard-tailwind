'use client';

import { Description, FieldError, Label, ListBox, Select as HeroSelect } from '@heroui/react';
import type { Key } from '@react-types/shared';
import React, { type ReactNode } from 'react';

export type SelectProps<T extends object = Record<string, unknown>> = {
    label?: React.ReactNode;
    placeholder?: string;
    description?: React.ReactNode;
    errorMessage?: React.ReactNode;
    children?: React.ReactNode | ((item: T) => React.ReactNode);
    items?: Iterable<T>;
    selectedKey?: Key | null;
    selectedKeys?: Iterable<Key>;
    defaultSelectedKeys?: Iterable<Key>;
    onSelectionChange?: (key: Key | null | Iterable<Key>) => void;
    selectionMode?: 'single' | 'multiple';
    className?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary';
    [key: string]: unknown;
};

export interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof ListBox.Item> {
    id: string | number;
    children: React.ReactNode;
    textValue?: string;
}

/**
 * SelectItem bọc chuẩn HeroUI v3 ListBox.Item
 */
export function SelectItem({
    id,
    children,
    textValue,
    className,
    ...props
}: Readonly<SelectItemProps>) {
    const computedText = textValue || (typeof children === 'string' ? children : undefined);
    return (
        <ListBox.Item id={id} textValue={computedText} className={className} {...props}>
            {children}
            <ListBox.ItemIndicator />
        </ListBox.Item>
    );
}

/**
 * Select Component chuẩn hóa HeroUI v3 thuần túy
 * Xóa sạch toàn bộ class Tailwind tự chế, sử dụng 100% Design Tokens và Theme gốc của HeroUI
 */
export function Select<T extends object = Record<string, unknown>>({
    label,
    placeholder = 'Chọn một mục',
    description,
    errorMessage,
    children,
    items,
    selectedKey,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    selectionMode = 'single',
    className,
    isDisabled,
    isRequired,
    isInvalid,
    ...props
}: Readonly<SelectProps<T>>) {
    const hasDirectTrigger = React.Children.toArray(
        typeof children === 'function' ? null : children
    ).some((child: unknown) => React.isValidElement(child) && child.type === HeroSelect.Trigger);

    const getSelectedKey = (keys: unknown): Key | undefined => {
        if (!keys) return undefined;
        if (Array.isArray(keys)) return keys[0] as Key;
        if (keys instanceof Set) return keys.values().next().value as Key;
        return keys as Key;
    };

    const currentKey = selectedKey ?? getSelectedKey(selectedKeys ?? defaultSelectedKeys);

    const handleSelectionChange = (key: Key | null) => {
        if (!onSelectionChange) return;
        try {
            onSelectionChange(key);
        } catch {
            onSelectionChange(new Set(key ? [key] : []));
        }
    };

    if (hasDirectTrigger) {
        return (
            <HeroSelect
                value={currentKey}
                onChange={handleSelectionChange}
                isDisabled={isDisabled}
                isRequired={isRequired}
                isInvalid={isInvalid}
                placeholder={placeholder}
                className={className}
                {...props}
            >
                {label && <Label>{label}</Label>}
                {children as React.ReactNode}
                {description && <Description>{description}</Description>}
                {errorMessage && <FieldError>{errorMessage}</FieldError>}
            </HeroSelect>
        );
    }

    return (
        <HeroSelect
            value={currentKey}
            onChange={handleSelectionChange}
            isDisabled={isDisabled}
            isRequired={isRequired}
            isInvalid={isInvalid}
            placeholder={placeholder}
            className={className}
            {...props}
        >
            {label && <Label>{label}</Label>}
            <HeroSelect.Trigger>
                <HeroSelect.Value />
                <HeroSelect.Indicator />
            </HeroSelect.Trigger>
            {description && <Description>{description}</Description>}
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
            <HeroSelect.Popover>
                <ListBox items={items} selectionMode={selectionMode}>
                    {children as ReactNode}
                </ListBox>
            </HeroSelect.Popover>
        </HeroSelect>
    );
}

Select.Trigger = HeroSelect.Trigger;
Select.Value = HeroSelect.Value;
Select.Indicator = HeroSelect.Indicator;
Select.Popover = HeroSelect.Popover;
Select.Item = SelectItem;

export { ListBox };
