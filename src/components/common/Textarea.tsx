import { Textarea as HeroTextArea, TextAreaProps as HeroTextAreaProps } from '@heroui/react';

export interface TextareaProps extends HeroTextAreaProps {
    // Add any specific props if needed
}

export function Textarea({
    radius = 'lg',
    variant = 'flat',
    labelPlacement = 'outside-top',
    ...props
}: TextareaProps) {
    return (
        <HeroTextArea
            radius={radius}
            variant={variant}
            labelPlacement={labelPlacement}
            classNames={{}}
            {...props}
        />
    );
}
