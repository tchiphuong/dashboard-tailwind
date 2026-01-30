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
    const isFlat = variant === 'flat';
    return (
        <HeroInput
            radius={radius}
            variant={variant}
            labelPlacement={labelPlacement}
            classNames={{
                inputWrapper: isFlat
                    ? 'bg-gray-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-zinc-900'
                    : 'bg-white dark:bg-zinc-900',
                ...classNames,
            }}
            {...props}
        />
    );
}
