import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CalendarDaysIcon,
    PlusIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';
import { Button, Modal, Input, Select, Card, PageHeader, ConfirmModal } from '@/components/common';
import { SelectItem } from '@heroui/react';

// Types
interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    type: 'meeting' | 'task' | 'reminder' | 'holiday' | 'other';
    location?: string;
    allDay?: boolean;
}

const EVENT_TYPES = [
    {
        key: 'meeting',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
    },
    {
        key: 'task',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
    },
    {
        key: 'reminder',
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800',
    },
    {
        key: 'holiday',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
    },
    {
        key: 'other',
        color: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400',
        border: 'border-zinc-200 dark:border-zinc-700',
    },
];

export function CalendarPage() {
    const { t, i18n } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(getMockEvents());

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
    const [formData, setFormData] = useState<Partial<CalendarEvent>>({});

    // Delete State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);

    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Previous month padding
        const startPadding = firstDay.getDay();
        for (let i = startPadding - 1; i >= 0; i--) {
            days.push(new Date(year, month, -i));
        }

        // Current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        // Next month padding
        const endPadding = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= endPadding; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    };

    const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

    // Helpers
    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSameMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

    const getDayEvents = (date: Date) => {
        return events.filter(
            (event) =>
                event.start.getDate() === date.getDate() &&
                event.start.getMonth() === date.getMonth() &&
                event.start.getFullYear() === date.getFullYear()
        );
    };

    // Handlers
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleDateClick = (date: Date) => {
        setEditingEvent(undefined);
        setFormData({
            start: date,
            end: new Date(date.getTime() + 60 * 60 * 1000), // +1 hour
            type: 'meeting',
            allDay: false,
        });
        setIsModalOpen(true);
    };

    const handleEditEvent = (event: CalendarEvent, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingEvent(event);
        setFormData({ ...event });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setEventToDelete(id);
        setIsModalOpen(false);
        setIsDeleteOpen(true);
    };

    const handleSave = () => {
        if (!formData.title || !formData.start || !formData.end) return;

        if (editingEvent) {
            setEvents((prev) =>
                prev.map((e) =>
                    e.id === editingEvent.id ? ({ ...formData, id: e.id } as CalendarEvent) : e
                )
            );
        } else {
            const newEvent: CalendarEvent = {
                ...formData,
                id: Date.now(),
            } as CalendarEvent;
            setEvents((prev) => [...prev, newEvent]);
        }
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (eventToDelete) {
            setEvents((prev) => prev.filter((e) => e.id !== eventToDelete));
        }
        setIsDeleteOpen(false);
        setEventToDelete(null);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] flex-col gap-4">
            <PageHeader
                title={t('calendar.title')}
                breadcrumbs={[{ label: t('menu.workflow') }, { label: t('menu.calendar') }]}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="bordered"
                            onPress={handleToday}
                            startContent={<CalendarDaysIcon className="h-4 w-4" />}
                        >
                            {t('calendar.today')}
                        </Button>
                        <div className="flex items-center rounded-full border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={handlePrevMonth}
                                radius="full"
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>
                            <span className="min-w-35 px-2 text-center font-semibold">
                                {currentDate.toLocaleString(i18n.language, {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={handleNextMonth}
                                radius="full"
                            >
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            color="primary"
                            onPress={() => handleDateClick(new Date())}
                            startContent={<PlusIcon className="h-4 w-4" />}
                        >
                            {t('calendar.addEvent')}
                        </Button>
                    </div>
                }
            />

            <Card className="flex-1 overflow-hidden p-0">
                <div className="grid h-full grid-cols-7 grid-rows-[auto_1fr]">
                    {/* Weekday Headers */}
                    {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => (
                        <div
                            key={day}
                            className="border-r border-b border-zinc-100 bg-gray-50 py-3 text-center text-sm font-semibold text-gray-500 last:border-r-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400"
                        >
                            {t(`calendar.weekdays.${day}`)}
                        </div>
                    ))}

                    {/* Calendar Grid */}
                    <div className="col-span-7 grid grid-cols-7 grid-rows-6">
                        {days.map((date, idx) => {
                            const dayEvents = getDayEvents(date);
                            const isCurrentMonth = isSameMonth(date);

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleDateClick(date)}
                                    className={`group relative flex min-h-25 flex-col gap-1 border-r border-b border-zinc-100 p-2 transition-colors last:border-r-0 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-gray-800/50 ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400 dark:bg-zinc-900/50 dark:text-gray-600' : ''} ${isToday(date) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''} `}
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${isToday(date) ? 'bg-blue-600 text-white shadow-md' : ''} `}
                                        >
                                            {date.getDate()}
                                        </span>
                                        {/* Add button visible on hover */}
                                        <button className="opacity-0 transition-opacity group-hover:opacity-100">
                                            <PlusIcon className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                                        </button>
                                    </div>

                                    {/* Events List */}
                                    <div className="flex flex-col gap-1 overflow-y-auto">
                                        {dayEvents.map((event) => {
                                            const typeStyle =
                                                EVENT_TYPES.find((t) => t.key === event.type) ||
                                                EVENT_TYPES[4];
                                            return (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => handleEditEvent(event, e)}
                                                    className={` ${typeStyle.color} ${typeStyle.border} flex cursor-pointer items-center gap-1 overflow-hidden rounded border px-1.5 py-0.5 text-xs shadow-sm transition-transform hover:scale-[1.02]`}
                                                >
                                                    <div
                                                        className={`h-1.5 w-1.5 min-w-1.5 rounded-full bg-current opacity-70`}
                                                    />
                                                    <span className="truncate font-medium">
                                                        {event.title}
                                                    </span>
                                                    {event.allDay ? null : (
                                                        <span className="ml-auto text-[10px] opacity-75">
                                                            {event.start.toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Event Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEvent ? t('calendar.editEvent') : t('calendar.addEvent')}
                size="2xl"
                footer={
                    <>
                        {editingEvent && (
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => handleDeleteClick(editingEvent.id)}
                                className="mr-auto"
                            >
                                {t('calendar.deleteEvent')}
                            </Button>
                        )}
                        <Button
                            color="danger"
                            variant="light"
                            onPress={() => setIsModalOpen(false)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button color="primary" onPress={handleSave}>
                            {t('common.save')}
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label={t('calendar.eventTitle')}
                        placeholder="e.g. Quarterly Review"
                        value={formData.title || ''}
                        onValueChange={(val) => setFormData((prev) => ({ ...prev, title: val }))}
                        isRequired
                        variant="bordered"
                        labelPlacement="outside"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="datetime-local"
                            label={t('calendar.startTime')}
                            value={formData.start ? toInputString(formData.start) : ''}
                            onValueChange={(val) =>
                                setFormData((prev) => ({ ...prev, start: new Date(val) }))
                            }
                            variant="bordered"
                            labelPlacement="outside"
                        />
                        <Input
                            type="datetime-local"
                            label={t('calendar.endTime')}
                            value={formData.end ? toInputString(formData.end) : ''}
                            onValueChange={(val) =>
                                setFormData((prev) => ({ ...prev, end: new Date(val) }))
                            }
                            variant="bordered"
                            labelPlacement="outside"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label={t('calendar.type')}
                            selectedKeys={formData.type ? [formData.type] : ['other']}
                            onSelectionChange={(keys) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    type: Array.from(keys)[0] as any,
                                }))
                            }
                            variant="bordered"
                            labelPlacement="outside"
                        >
                            {EVENT_TYPES.map((type) => (
                                <SelectItem
                                    key={type.key}
                                    startContent={
                                        <div
                                            className={`h-2 w-2 rounded-full ${type.color.split(' ')[0]}`}
                                        />
                                    }
                                >
                                    {t(`calendar.types.${type.key}`)}
                                </SelectItem>
                            ))}
                        </Select>

                        <Input
                            label="Location"
                            placeholder="e.g. Room 302"
                            startContent={<MapPinIcon className="h-4 w-4 text-gray-400" />}
                            value={formData.location || ''}
                            onValueChange={(val) =>
                                setFormData((prev) => ({ ...prev, location: val }))
                            }
                            variant="bordered"
                            labelPlacement="outside"
                        />
                    </div>

                    <Input
                        label={t('calendar.eventDescription')}
                        placeholder="Add details..."
                        value={formData.description || ''}
                        onValueChange={(val) =>
                            setFormData((prev) => ({ ...prev, description: val }))
                        }
                        variant="bordered"
                        labelPlacement="outside"
                    />
                </div>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('calendar.deleteConfirmTitle')}
                message={t('calendar.deleteConfirm')}
                confirmText={t('common.delete')}
                type="danger"
            />
        </div>
    );
}

// Utils
function toInputString(date: Date) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
}

function getMockEvents(): CalendarEvent[] {
    const today = new Date();
    return [
        {
            id: 1,
            title: 'Team Meeting',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
            type: 'meeting',
            location: 'Conference Room A',
        },
        {
            id: 2,
            title: 'Project Deadline',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 18, 0),
            type: 'task',
            allDay: true,
        },
        {
            id: 3,
            title: 'Client Lunch',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 12, 30),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 14, 0),
            type: 'other',
            location: 'Bistro SQL',
        },
        {
            id: 4,
            title: 'Quarterly Review',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 9, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 12, 0),
            type: 'meeting',
        },
    ];
}
