import { Select as HeroSelect, SelectProps as HeroSelectProps } from '@heroui/react';

export interface SelectProps<T extends object = object> extends HeroSelectProps<T> {
    // Add any specific props if needed
}

export function Select<T extends object = object>({
    children,
    radius = 'full',
    variant = 'bordered',
    labelPlacement = 'outside-top',
    classNames,
    ...props
}: SelectProps<T>) {
    const isFlat = variant === 'flat';

    return (
        <HeroSelect
            radius={radius}
            variant={variant}
            labelPlacement={labelPlacement}
            classNames={{
                trigger: isFlat
                    ? 'bg-gray-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors data-[focus=true]:bg-white dark:data-[focus=true]:bg-zinc-900'
                    : 'bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-1',
                ...classNames,
            }}
            {...props}
        >
            {children}
        </HeroSelect>
    );
}
