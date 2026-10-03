'use client';

import { Description, FieldError, Label, NumberField as HeroNumberField } from '@heroui/react';
import { type ReactNode } from 'react';

export interface NumberFieldProps {
    label?: ReactNode;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    minValue?: number;
    maxValue?: number;
    step?: number;
    formatOptions?: Intl.NumberFormatOptions;
    variant?: 'primary' | 'secondary';
    placeholder?: string;
    description?: ReactNode;
    errorMessage?: ReactNode;
    className?: string;
    fullWidth?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    name?: string;
    id?: string;
}

/**
 * NumberField Component chuẩn hóa HeroUI v3 Compound
 * Sử dụng 100% HeroNumberField, Group, Input, Increment/Decrement Button chính hãng
 */
export function NumberField({
    label,
    value,
    defaultValue,
    onChange,
    minValue,
    maxValue,
    step,
    formatOptions,
    variant = 'primary',
    placeholder,
    description,
    errorMessage,
    className = 'w-full',
    fullWidth = true,
    isDisabled,
    isRequired,
    isInvalid,
    name,
    id,
    ...props
}: Readonly<NumberFieldProps>) {
    return (
        <HeroNumberField
            id={id}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            formatOptions={formatOptions}
            variant={variant}
            fullWidth={fullWidth}
            isDisabled={isDisabled}
            isRequired={isRequired}
            isInvalid={isInvalid}
            className={className}
            {...props}
        >
            {label && <Label>{label}</Label>}
            <HeroNumberField.Group>
                <HeroNumberField.DecrementButton />
                <HeroNumberField.Input placeholder={placeholder} />
                <HeroNumberField.IncrementButton />
            </HeroNumberField.Group>
            {description && <Description>{description}</Description>}
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </HeroNumberField>
    );
}

NumberField.Group = HeroNumberField.Group;
NumberField.Input = HeroNumberField.Input;
NumberField.DecrementButton = HeroNumberField.DecrementButton;
NumberField.IncrementButton = HeroNumberField.IncrementButton;
