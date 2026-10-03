"use client";

import { FieldError, Input, Label, TextField } from "@heroui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormInputProps extends React.ComponentProps<typeof TextField> {
    name: string;
    label?: string;
    placeholder?: string;
    type?: string;
}

export function FormInput({
    name,
    label,
    className,
    placeholder,
    type,
    ...props
}: FormInputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    {...props}
                    isInvalid={!!error}
                    className={className}
                    value={field.value || ""}
                    onChange={field.onChange}
                >
                    {label && <Label>{label}</Label>}
                    <Input placeholder={placeholder} type={type} />
                    {error && <FieldError>{error.message}</FieldError>}
                </TextField>
            )}
        />
    );
}
