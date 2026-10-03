"use client";

import {
    ColorArea,
    ColorField,
    ColorPicker as HeroColorPicker,
    ColorSlider,
    ColorSwatch,
    Description,
    FieldError,
    Label,
    parseColor,
    type Color,
} from "@heroui/react";
import { useMemo } from "react";

export interface ColorPickerProps {
    label?: string;
    description?: string;
    errorMessage?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (hexValue: string) => void;
    className?: string;
    isDisabled?: boolean;
}

/**
 * ColorPicker Component - Chuẩn hóa HeroUI v3 Color Picker
 * Xóa bỏ hoàn toàn thẻ <input type="color"> thô sơ và class Tailwind tự chế
 */
export function ColorPicker({
    label,
    description,
    errorMessage,
    value,
    defaultValue = "#0485F7",
    onChange,
    className,
    isDisabled,
}: Readonly<ColorPickerProps>) {
    const parsedColor = useMemo(() => {
        if (!value) return undefined;
        try {
            return parseColor(value);
        } catch {
            return undefined;
        }
    }, [value]);

    const parsedDefaultColor = useMemo(() => {
        try {
            return parseColor(defaultValue);
        } catch {
            return parseColor("#0485F7");
        }
    }, [defaultValue]);

    const handleColorChange = (newColor: Color) => {
        onChange?.(newColor.toString("hex"));
    };

    return (
        <HeroColorPicker
            value={parsedColor}
            defaultValue={parsedDefaultColor}
            onChange={handleColorChange}
            className={className}
        >
            {label && <Label>{label}</Label>}
            <HeroColorPicker.Trigger isDisabled={isDisabled}>
                <ColorSwatch />
                <Label>{value || defaultValue}</Label>
            </HeroColorPicker.Trigger>
            <HeroColorPicker.Popover>
                <ColorArea
                    aria-label="Vùng chọn màu"
                    colorSpace="hsb"
                    xChannel="saturation"
                    yChannel="brightness"
                >
                    <ColorArea.Thumb />
                </ColorArea>
                <ColorSlider channel="hue" colorSpace="hsb">
                    <Label>Màu sắc</Label>
                    <ColorSlider.Output />
                    <ColorSlider.Track>
                        <ColorSlider.Thumb />
                    </ColorSlider.Track>
                </ColorSlider>
                <ColorField aria-label="Mã màu">
                    <ColorField.Group>
                        <ColorField.Prefix>
                            <ColorSwatch size="xs" />
                        </ColorField.Prefix>
                        <ColorField.Input />
                    </ColorField.Group>
                </ColorField>
            </HeroColorPicker.Popover>
            {description && <Description>{description}</Description>}
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </HeroColorPicker>
    );
}

ColorPicker.Trigger = HeroColorPicker.Trigger;
ColorPicker.Popover = HeroColorPicker.Popover;

export {
    HeroColorPicker,
    ColorArea,
    ColorField,
    ColorSlider,
    ColorSwatch,
    parseColor,
};
export type { Color };
