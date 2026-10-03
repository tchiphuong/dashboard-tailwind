"use client";

import { FieldError, Label, ListBox, Select } from "@heroui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Option {
    label: string;
    value: string | number;
}

interface FormSelectProps extends Omit<
    React.ComponentProps<typeof Select>,
    "children" | "onChange" | "value"
> {
    name: string;
    label?: string;
    options: Option[];
    placeholder?: string;
}

export function FormSelect({
    name,
    label,
    options,
    className,
    placeholder,
    ...props
}: FormSelectProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Select
                    {...field}
                    {...props}
                    selectedKey={field.value ? String(field.value) : undefined}
                    onSelectionChange={(key) => {
                        if (key) {
                            field.onChange(String(key));
                        }
                    }}
                    isInvalid={!!error}
                    className={className}
                    placeholder={placeholder}
                >
                    {label && <Label>{label}</Label>}
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    {error && <FieldError>{error.message}</FieldError>}
                    <Select.Popover>
                        <ListBox>
                            {options.map((option) => (
                                <ListBox.Item
                                    key={option.value}
                                    id={String(option.value)}
                                    textValue={option.label}
                                >
                                    {option.label}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>
            )}
        />
    );
}
