'use client';

import {
    Description,
    FieldError,
    InputGroup,
    Input as HeroInput,
    Label,
    TextField,
} from '@heroui/react';
import React from 'react';

export interface InputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'prefix'
> {
    label?: React.ReactNode;
    description?: React.ReactNode;
    errorMessage?: React.ReactNode;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    onValueChange?: (val: string) => void;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    isClearable?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
}

/**
 * Input Component chuẩn hóa HeroUI v3
 * Tích hợp chuẩn TextField, Label, InputGroup và FieldError chính hãng thay vì bọc div và span thủ công
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            description,
            errorMessage,
            startContent,
            endContent,
            onValueChange,
            onChange,
            variant = 'primary',
            isInvalid,
            isRequired,
            isDisabled,
            className,
            placeholder,
            type,
            value,
            defaultValue,
            ...props
        },
        ref
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
        };

        const renderInputControl = () => {
            if (startContent || endContent) {
                return (
                    <InputGroup>
                        {startContent && <InputGroup.Prefix>{startContent}</InputGroup.Prefix>}
                        <HeroInput
                            ref={ref}
                            variant={variant}
                            placeholder={placeholder}
                            type={type}
                            value={value}
                            defaultValue={defaultValue}
                            onChange={handleChange}
                            {...props}
                        />
                        {endContent && <InputGroup.Suffix>{endContent}</InputGroup.Suffix>}
                    </InputGroup>
                );
            }

            return (
                <HeroInput
                    ref={ref}
                    variant={variant}
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                    {...props}
                />
            );
        };

        if (label || errorMessage || description) {
            return (
                <TextField
                    isInvalid={isInvalid}
                    isRequired={isRequired}
                    isDisabled={isDisabled}
                    className={className}
                >
                    {label && <Label>{label}</Label>}
                    {renderInputControl()}
                    {description && <Description>{description}</Description>}
                    {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </TextField>
            );
        }

        return renderInputControl();
    }
);

Input.displayName = 'Input';
