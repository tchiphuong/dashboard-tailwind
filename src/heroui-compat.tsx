/* eslint-disable */
import React, { createContext, useContext, useState } from 'react';

export type SortDescriptor = {
    column?: React.Key;
    direction?: 'ascending' | 'descending';
};

export type Selection = 'all' | Set<React.Key>;

type AnyProps = Record<string, any>;

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const stripProps = ({
    as,
    color,
    variant,
    radius,
    size,
    isDisabled,
    isLoading,
    isIconOnly,
    isClearable,
    isInvalid,
    isRequired,
    isSelected,
    isIndeterminate,
    isBordered,
    defaultSelected,
    onPress,
    onValueChange,
    startContent,
    endContent,
    classNames,
    fullWidth,
    ...rest
}: AnyProps) => rest;

const variantClasses = (variant?: string) =>
    cx(
        variant === 'bordered' && 'border border-default-200 bg-transparent',
        variant === 'light' && 'bg-transparent',
        variant === 'flat' && 'bg-default-100',
        variant === 'ghost' && 'border border-default-300 bg-transparent',
        variant === 'shadow' && 'shadow-sm'
    );

const colorClasses = (color?: string) =>
    cx(
        color === 'primary' && 'bg-primary text-primary-foreground',
        color === 'secondary' && 'bg-secondary text-secondary-foreground',
        color === 'success' && 'bg-success text-success-foreground',
        color === 'warning' && 'bg-warning text-warning-foreground',
        color === 'danger' && 'bg-danger text-danger-foreground'
    );

export type ButtonProps = AnyProps;
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
    const {
        as,
        children,
        className,
        color,
        variant,
        isDisabled,
        isLoading,
        onPress,
        startContent,
        endContent,
        fullWidth,
        type,
        href,
    } = props;
    const Component = as || (href ? 'a' : 'button');
    const rest = stripProps(props);

    return (
        <Component
            {...rest}
            ref={ref as any}
            href={href}
            type={Component === 'button' ? type || 'button' : undefined}
            disabled={isDisabled || isLoading}
            onClick={onPress || props.onClick}
            className={cx(
                'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
                fullWidth && 'w-full',
                colorClasses(color),
                variantClasses(variant),
                !color && !variant && 'bg-default-100 text-foreground',
                className
            )}
        >
            {startContent}
            {children}
            {endContent}
        </Component>
    );
});
Button.displayName = 'Button';

export type InputProps = AnyProps;
export function Input(props: InputProps) {
    const { className, classNames, startContent, endContent, onValueChange, label, fullWidth = true } = props;
    const rest = stripProps(props);

    return (
        <label className={cx('block', fullWidth && 'w-full', classNames?.base)}>
            {label && <span className="mb-1 block text-sm text-default-600">{label}</span>}
            <span
                className={cx(
                    'flex items-center gap-2 rounded-full border border-default-200 bg-content1 px-3 py-2',
                    classNames?.inputWrapper,
                    className
                )}
            >
                {startContent}
                <input
                    {...rest}
                    className={cx('min-w-0 flex-1 bg-transparent text-sm outline-none', classNames?.input)}
                    onChange={(event) => {
                        props.onChange?.(event);
                        onValueChange?.(event.currentTarget.value);
                    }}
                />
                {endContent}
            </span>
        </label>
    );
}

export type TextAreaProps = AnyProps;
export function Textarea(props: TextAreaProps) {
    const { className, classNames, onValueChange, label, fullWidth = true } = props;
    const rest = stripProps(props);

    return (
        <label className={cx('block', fullWidth && 'w-full', classNames?.base)}>
            {label && <span className="mb-1 block text-sm text-default-600">{label}</span>}
            <textarea
                {...rest}
                className={cx(
                    'min-h-24 w-full rounded-2xl border border-default-200 bg-content1 px-3 py-2 text-sm outline-none',
                    classNames?.input,
                    className
                )}
                onChange={(event) => {
                    props.onChange?.(event);
                    onValueChange?.(event.currentTarget.value);
                }}
            />
        </label>
    );
}
export const TextArea = Textarea;

export type SelectProps<T = any> = AnyProps & { items?: T[] };
export function Select(props: SelectProps) {
    const { children, className, label, selectedKeys, defaultSelectedKeys, onSelectionChange, onChange } = props;
    const value = firstKey(selectedKeys ?? defaultSelectedKeys) ?? props.value ?? '';

    return (
        <label className={cx('block w-full', className)}>
            {label && <span className="mb-1 block text-sm text-default-600">{label}</span>}
            <select
                value={String(value)}
                className="w-full rounded-full border border-default-200 bg-content1 px-3 py-2 text-sm outline-none"
                onChange={(event) => {
                    onChange?.(event);
                    onSelectionChange?.(new Set([event.currentTarget.value]));
                }}
            >
                {children}
            </select>
        </label>
    );
}

export function SelectItem(props: AnyProps) {
    const value = props.id ?? props.value ?? props.children;
    return <option value={String(value)}>{props.children}</option>;
}

function firstKey(keys: any) {
    if (!keys || keys === 'all') return undefined;
    if (keys instanceof Set) return keys.values().next().value;
    if (Array.isArray(keys)) return keys[0];
    return keys;
}

export function Chip(props: AnyProps) {
    const { children, className, color, variant } = props;
    return (
        <span
            className={cx(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                colorClasses(color),
                variantClasses(variant),
                !color && 'bg-default-100 text-default-700',
                className
            )}
        >
            {children}
        </span>
    );
}

export function Card(props: AnyProps) {
    const { children, className } = props;
    return <div className={cx('rounded-lg border border-default-200 bg-content1 shadow-sm', className)}>{children}</div>;
}

export function CardBody(props: AnyProps) {
    return <div className={cx('p-4', props.className)}>{props.children}</div>;
}

export function CardHeader(props: AnyProps) {
    return <div className={cx('border-b border-default-200 p-4 font-semibold', props.className)}>{props.children}</div>;
}

export function CardFooter(props: AnyProps) {
    return <div className={cx('border-t border-default-200 p-4', props.className)}>{props.children}</div>;
}

export function Divider(props: AnyProps) {
    return <hr className={cx('border-default-200', props.className)} />;
}

export function Avatar(props: AnyProps) {
    const { src, alt, name, className, size = 'md' } = props;
    const sizes: Record<string, string> = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
    return (
        <span className={cx('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-default-200', sizes[size], className)}>
            {src ? <img src={src} alt={alt || name || ''} className="h-full w-full object-cover" /> : name?.slice(0, 2)}
        </span>
    );
}

export function User(props: AnyProps) {
    const { name, description, avatarProps, className } = props;
    return (
        <span className={cx('inline-flex items-center gap-2', className)}>
            <Avatar {...avatarProps} name={name} />
            <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{name}</span>
                {description && <span className="block truncate text-xs text-default-500">{description}</span>}
            </span>
        </span>
    );
}

export function Progress(props: AnyProps) {
    const value = Number(props.value ?? 0);
    return (
        <div className={cx('h-2 w-full overflow-hidden rounded-full bg-default-100', props.className)}>
            <div className={cx('h-full bg-primary', colorClasses(props.color))} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
        </div>
    );
}

export function Spinner(props: AnyProps) {
    return <span className={cx('inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent', props.className)} />;
}

export function Checkbox(props: AnyProps) {
    const { children, isSelected, defaultSelected, onValueChange, className } = props;
    return (
        <label className={cx('inline-flex items-center gap-2 text-sm', className)}>
            <input
                type="checkbox"
                checked={isSelected}
                defaultChecked={defaultSelected}
                onChange={(event) => onValueChange?.(event.currentTarget.checked)}
            />
            {children}
        </label>
    );
}

export function Switch(props: AnyProps) {
    return <Checkbox {...props} />;
}

export function Form(props: AnyProps) {
    return <form {...stripProps(props)} className={props.className}>{props.children}</form>;
}

const ModalContext = createContext<(() => void) | undefined>(undefined);

export function Modal(props: AnyProps) {
    if (!props.isOpen) return null;
    return (
        <ModalContext.Provider value={props.onClose}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className={cx('max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-content1 shadow-xl', props.className)}>
                    {typeof props.children === 'function' ? props.children(props.onClose) : props.children}
                </div>
            </div>
        </ModalContext.Provider>
    );
}

export function ModalContent(props: AnyProps) {
    const onClose = useContext(ModalContext);
    return <>{typeof props.children === 'function' ? props.children(onClose) : props.children}</>;
}
export function ModalHeader(props: AnyProps) { return <div className={cx('border-b border-default-200 p-4 font-semibold', props.className)}>{props.children}</div>; }
export function ModalBody(props: AnyProps) { return <div className={cx('p-4', props.className)}>{props.children}</div>; }
export function ModalFooter(props: AnyProps) { return <div className={cx('flex justify-end gap-2 border-t border-default-200 p-4', props.className)}>{props.children}</div>; }

export function useDisclosure(defaultOpen = false) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return {
        isOpen,
        onOpen: () => setIsOpen(true),
        onClose: () => setIsOpen(false),
        onOpenChange: (open?: boolean) => setIsOpen((current) => (typeof open === 'boolean' ? open : !current)),
    };
}

import { Dropdown as HeroUIDropdown } from '@heroui/react';

export function Dropdown({ children, ...props }: AnyProps) {
    return <HeroUIDropdown {...props}>{children}</HeroUIDropdown>;
}

export function DropdownTrigger(props: AnyProps) {
    // If the child is our custom Button, we should clone it and inject as="div" to avoid nested <button>
    const child = React.Children.only(props.children);
    const childProps = { ...child.props };
    // We can't easily detect if it's our Button, but we can just pass as="div" which our Button supports.
    if (childProps.as === undefined && typeof child.type !== 'string') {
        childProps.as = 'div';
    }
    
    return (
        <HeroUIDropdown.Trigger {...props}>
            {React.cloneElement(child, childProps)}
        </HeroUIDropdown.Trigger>
    );
}

export function DropdownMenu(props: AnyProps) {
    return (
        <HeroUIDropdown.Popover>
            <HeroUIDropdown.Menu {...props} />
        </HeroUIDropdown.Popover>
    );
}

export function DropdownItem(props: AnyProps) {
    return <HeroUIDropdown.Item {...props} />;
}

export function Tooltip(props: AnyProps) {
    return <span title={props.content} className={props.className}>{props.children}</span>;
}

export function Skeleton(props: AnyProps) {
    return <div className={cx('animate-pulse rounded bg-default-100', props.className)}>{props.children}</div>;
}

export function Pagination(props: AnyProps) {
    const page = Number(props.page ?? 1);
    const total = Number(props.total ?? 1);
    return (
        <div className={cx('inline-flex items-center gap-2', props.className)}>
            <Button isDisabled={page <= 1} onPress={() => props.onChange?.(page - 1)}>Prev</Button>
            <span className="text-sm">{page} / {total}</span>
            <Button isDisabled={page >= total} onPress={() => props.onChange?.(page + 1)}>Next</Button>
        </div>
    );
}

const TableColumnsContext = createContext<any[]>([]);

export function Table(props: AnyProps) {
    const columns = props.children?.[0]?.props?.columns ?? [];
    return (
        <TableColumnsContext.Provider value={columns}>
            <table className={cx('w-full border-collapse text-sm', props.className)}>{props.children}</table>
        </TableColumnsContext.Provider>
    );
}

export function TableHeader(props: AnyProps) {
    const columns = props.columns ?? [];
    const render = typeof props.children === 'function' ? props.children : undefined;
    return <thead><tr>{render ? columns.map((column: any) => render(column)) : props.children}</tr></thead>;
}
export function TableColumn(props: AnyProps) { return <th className={cx('border-b border-default-200 px-3 py-2 text-left', props.className)}>{props.children}</th>; }
export function TableBody(props: AnyProps) {
    const rows = props.items ?? [];
    const renderRow = typeof props.children === 'function' ? props.children : undefined;
    if (props.isLoading) return <tbody><tr><td className="p-4">Loading...</td></tr></tbody>;
    return <tbody>{renderRow ? rows.map((item: any) => renderRow(item)) : props.children || props.emptyContent}</tbody>;
}
export function TableRow(props: AnyProps) {
    const columns = useContext(TableColumnsContext);
    const cells = typeof props.children === 'function'
        ? columns.map((column: any) => props.children(column.key ?? column.id))
        : props.children;
    return <tr className={props.className}>{cells}</tr>;
}
export function TableCell(props: AnyProps) { return <td className={cx('border-b border-default-100 px-3 py-2', props.className)}>{props.children}</td>; }

export function Tabs(props: AnyProps) {
    return <div className={props.className}>{props.children}</div>;
}

export function Tab(props: AnyProps) {
    return <div className={props.className}>{props.children}</div>;
}

export type TabsProps = AnyProps;
export type TabItemProps = AnyProps;

export default {};
