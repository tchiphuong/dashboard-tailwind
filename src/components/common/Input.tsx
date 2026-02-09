import { Input as HeroInput, InputProps as HeroInputProps } from '@heroui/react';

export interface InputProps extends HeroInputProps {
    // Add any specific props if needed
}

export function Input({
    radius = 'full',
    variant = 'flat',
    labelPlacement = 'outside-top',
    classNames,
    ...props
}: InputProps) {
    return (
        <HeroInput
            radius={radius}
            variant={variant}
            labelPlacement={labelPlacement}
            classNames={{
                ...classNames,
            }}
            {...props}
        />
    );
}
