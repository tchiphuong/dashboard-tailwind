'use client';

import {
    DateField,
    DateRangePicker as HeroDateRangePicker,
    Label,
    Description,
    FieldError,
    RangeCalendar,
} from '@heroui/react';
import type { DateValue } from '@internationalized/date';
import type { ReactNode } from 'react';

export type DateRangeValue = {
    start: DateValue;
    end: DateValue;
};

export interface DateRangePickerProps {
    label?: ReactNode;
    value?: DateRangeValue | null;
    defaultValue?: DateRangeValue | null;
    onChange?: (value: DateRangeValue | null) => void;
    variant?: 'primary' | 'secondary';
    className?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMessage?: ReactNode;
    description?: ReactNode;
    startName?: string;
    endName?: string;
}

/**
 * DateRangePicker component chuẩn hóa HeroUI v3 Compound
 * Sử dụng 100% DateField, RangeCalendar và Popover chính hãng
 */
export function DateRangePicker({
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
    startName,
    endName,
    ...props
}: Readonly<DateRangePickerProps>) {
    return (
        <HeroDateRangePicker
            className={className}
            startName={startName}
            endName={endName}
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
                <DateField.Input slot="start">
                    {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <HeroDateRangePicker.RangeSeparator />
                <DateField.Input slot="end">
                    {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                    <HeroDateRangePicker.Trigger>
                        <HeroDateRangePicker.TriggerIndicator />
                    </HeroDateRangePicker.Trigger>
                </DateField.Suffix>
            </DateField.Group>
            {description && <Description>{description}</Description>}
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
            <HeroDateRangePicker.Popover>
                <RangeCalendar aria-label={typeof label === 'string' ? label : 'Chọn khoảng ngày'}>
                    <RangeCalendar.Header>
                        <RangeCalendar.YearPickerTrigger>
                            <RangeCalendar.YearPickerTriggerHeading />
                            <RangeCalendar.YearPickerTriggerIndicator />
                        </RangeCalendar.YearPickerTrigger>
                        <RangeCalendar.NavButton slot="previous" />
                        <RangeCalendar.NavButton slot="next" />
                    </RangeCalendar.Header>
                    <RangeCalendar.Grid>
                        <RangeCalendar.GridHeader>
                            {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                        </RangeCalendar.GridHeader>
                        <RangeCalendar.GridBody>
                            {(date) => <RangeCalendar.Cell date={date} />}
                        </RangeCalendar.GridBody>
                    </RangeCalendar.Grid>
                    <RangeCalendar.YearPickerGrid>
                        <RangeCalendar.YearPickerGridBody>
                            {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                        </RangeCalendar.YearPickerGridBody>
                    </RangeCalendar.YearPickerGrid>
                </RangeCalendar>
            </HeroDateRangePicker.Popover>
        </HeroDateRangePicker>
    );
}

DateRangePicker.Root = HeroDateRangePicker;
DateRangePicker.Trigger = HeroDateRangePicker.Trigger;
DateRangePicker.Popover = HeroDateRangePicker.Popover;
export { RangeCalendar };
