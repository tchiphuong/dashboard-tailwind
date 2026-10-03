'use client';

import {
    Calendar,
    DateField,
    DatePicker as HeroDatePicker,
    Label,
    Description,
    FieldError,
} from '@heroui/react';
import type { DateValue } from '@internationalized/date';
import type { ReactNode } from 'react';

export interface DatePickerProps {
    label?: ReactNode;
    value?: DateValue | null;
    defaultValue?: DateValue | null;
    onChange?: (value: DateValue | null) => void;
    placeholder?: string;
    variant?: 'primary' | 'secondary';
    className?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMessage?: ReactNode;
    description?: ReactNode;
    name?: string;
}

/**
 * DatePicker component chuẩn hóa HeroUI v3 Compound
 * Sử dụng 100% Calendar, DateField và Popover chính hãng
 */
export function DatePicker({
    label,
    value,
    defaultValue,
    onChange,
    variant = 'primary',
    className = 'w-full',
    isDisabled,
    isRequired,
    isInvalid,
    errorMessage,
    description,
    name,
    ...props
}: Readonly<DatePickerProps>) {
    return (
        <HeroDatePicker
            className={className}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            isDisabled={isDisabled}
            isRequired={isRequired}
            isInvalid={isInvalid}
            {...props}
        >
            {label && <Label>{label}</Label>}
            <DateField.Group fullWidth variant={variant}>
                <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                    <HeroDatePicker.Trigger>
                        <HeroDatePicker.TriggerIndicator />
                    </HeroDatePicker.Trigger>
                </DateField.Suffix>
            </DateField.Group>
            {description && <Description>{description}</Description>}
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
            <HeroDatePicker.Popover>
                <Calendar aria-label={typeof label === 'string' ? label : 'Chọn ngày'}>
                    <Calendar.Header>
                        <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                        </Calendar.YearPickerTrigger>
                        <Calendar.NavButton slot="previous" />
                        <Calendar.NavButton slot="next" />
                    </Calendar.Header>
                    <Calendar.Grid>
                        <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                        </Calendar.GridHeader>
                        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                        <Calendar.YearPickerGridBody>
                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                        </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                </Calendar>
            </HeroDatePicker.Popover>
        </HeroDatePicker>
    );
}

DatePicker.Root = HeroDatePicker;
DatePicker.Trigger = HeroDatePicker.Trigger;
DatePicker.Popover = HeroDatePicker.Popover;
export { Calendar, DateField };
export type { DateValue };
