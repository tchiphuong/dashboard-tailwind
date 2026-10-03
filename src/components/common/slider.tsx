'use client';

import {
    Description,
    FieldError,
    Label,
    Slider as HeroSlider,
} from '@heroui/react';
import type { ReactNode } from 'react';

export interface SliderProps {
    label?: ReactNode;
    value?: number | number[];
    defaultValue?: number | number[];
    onChange?: (value: number | number[]) => void;
    minValue?: number;
    maxValue?: number;
    step?: number;
    formatOptions?: Intl.NumberFormatOptions;
    orientation?: 'horizontal' | 'vertical';
    description?: ReactNode;
    errorMessage?: ReactNode;
    className?: string;
    isDisabled?: boolean;
    name?: string;
    id?: string;
}

/**
 * Slider Component chuẩn hóa HeroUI v3 Compound
 * Hỗ trợ cả Single Value lẫn Range Slider [min, max] kèm formatOptions
 */
export function Slider({
    label,
    value,
    defaultValue,
    onChange,
    minValue = 0,
    maxValue = 100,
    step = 1,
    formatOptions,
    orientation = 'horizontal',
    description,
    errorMessage,
    className = 'w-full',
    isDisabled,
    id,
    ...props
}: Readonly<SliderProps>) {
    return (
        <HeroSlider
            id={id}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            formatOptions={formatOptions}
            orientation={orientation}
            isDisabled={isDisabled}
            className={className}
            {...props}
        >
            {label && <Label>{label}</Label>}
            <HeroSlider.Output />
            <HeroSlider.Track>
                {({ state }) => {
                    const count = state.values.length;
                    if (count === 2) {
                        return (
                            <>
                                <HeroSlider.Fill />
                                <HeroSlider.Thumb index={0} />
                                <HeroSlider.Thumb index={1} />
                            </>
                        );
                    }
                    if (count === 3) {
                        return (
                            <>
                                <HeroSlider.Fill />
                                <HeroSlider.Thumb index={0} />
                                <HeroSlider.Thumb index={1} />
                                <HeroSlider.Thumb index={2} />
                            </>
                        );
                    }
                    return (
                        <>
                            <HeroSlider.Fill />
                            <HeroSlider.Thumb index={0} />
                        </>
                    );
                }}
            </HeroSlider.Track>
            {description && <Description>{description}</Description>}
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </HeroSlider>
    );
}

Slider.Output = HeroSlider.Output;
Slider.Track = HeroSlider.Track;
Slider.Fill = HeroSlider.Fill;
Slider.Thumb = HeroSlider.Thumb;
