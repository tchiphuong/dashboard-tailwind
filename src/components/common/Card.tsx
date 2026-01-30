import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: string;
    onClick?: () => void;
}

export function Card({ children, className = '', padding = 'p-6', onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`rounded-xl border border-zinc-200 bg-white shadow-sm transition-all dark:border-zinc-700 dark:bg-zinc-800 ${padding} ${className} ${
                onClick ? 'cursor-pointer hover:shadow-md' : ''
            }`}
        >
            {children}
        </div>
    );
}
