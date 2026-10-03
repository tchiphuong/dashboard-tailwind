"use client";

import {
    Description,
    FieldError,
    Label,
    TextArea as HeroTextArea,
    TextField,
} from "@heroui/react";
import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: React.ReactNode;
    description?: React.ReactNode;
    errorMessage?: React.ReactNode;
    onValueChange?: (val: string) => void;
    variant?: "primary" | "secondary";
    isRequired?: boolean;
    isInvalid?: boolean;
    isDisabled?: boolean;
}

/**
 * Textarea Component chuẩn hóa HeroUI v3
 * Tích hợp chuẩn TextField, Label, TextArea và FieldError chính hãng thay vì bọc div và span thủ công
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            description,
            errorMessage,
            onValueChange,
            onChange,
            variant = "primary",
            isRequired,
            isInvalid,
            isDisabled,
            className,
            placeholder,
            value,
            defaultValue,
            ...props
        },
        ref,
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
        };

        const renderTextAreaControl = () => (
            <HeroTextArea
                ref={ref}
                variant={variant}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={handleChange}
                {...props}
            />
        );

        if (label || errorMessage || description) {
            return (
                <TextField
                    isInvalid={isInvalid}
                    isRequired={isRequired}
                    isDisabled={isDisabled}
                    className={className}
                >
                    {label && <Label>{label}</Label>}
                    {renderTextAreaControl()}
                    {description && <Description>{description}</Description>}
                    {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </TextField>
            );
        }

        return renderTextAreaControl();
    },
);

Textarea.displayName = "Textarea";
export const TextArea = Textarea;
