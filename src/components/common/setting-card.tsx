import { ReactNode } from "react";
import { Card } from "./card";

export interface SettingCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

/**
 * Reusable Setting Card Component
 * Chuẩn hóa theo HeroUI v3 Card Compound Pattern, xóa sạch thẻ div giả card
 */
export function SettingCard({
    title,
    description,
    children,
    className,
}: Readonly<SettingCardProps>) {
    return (
        <Card className={className}>
            <Card.Header>
                <Card.Title>{title}</Card.Title>
                {description && <Card.Description>{description}</Card.Description>}
            </Card.Header>
            <Card.Content>
                {children}
            </Card.Content>
        </Card>
    );
}
