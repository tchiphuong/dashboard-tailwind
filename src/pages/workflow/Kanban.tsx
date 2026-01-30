import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    PlusIcon,
    EllipsisHorizontalIcon,
    Bars2Icon,
    ChatBubbleLeftIcon,
    PaperClipIcon,
} from '@heroicons/react/24/outline';
import { Button, Modal, Input, Select, PageHeader, ConfirmModal } from '@/components/common';
import {
    SelectItem,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@heroui/react';

// Types
type ColumnId = 'todo' | 'inProgress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high';

interface Task {
    id: number;
    title: string;
    description?: string;
    columnId: ColumnId;
    priority: Priority;
    assignees?: string[];
    comments?: number;
    attachments?: number;
}

interface Column {
    id: ColumnId;
    title: string;
}

const PRIORITIES: {
    [key in Priority]: {
        color: 'success' | 'warning' | 'danger' | 'default' | 'primary' | 'secondary';
        label: string;
    };
} = {
    low: { color: 'success', label: 'kanban.priority.low' },
    medium: { color: 'warning', label: 'kanban.priority.medium' },
    high: { color: 'danger', label: 'kanban.priority.high' },
};

// Sortable Item Component
function SortableTask({
    task,
    onClick,
    onDelete,
}: {
    task: Task;
    onClick: (task: Task) => void;
    onDelete: (id: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20 h-30 rounded-xl border-2 opacity-50"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(task)}
            className="group hover:border-primary-300 dark:hover:border-primary-600 relative flex cursor-grab flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800"
        >
            <div className="flex items-start justify-between gap-2">
                <span className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                </span>
                <Dropdown>
                    <DropdownTrigger>
                        <button className="opacity-0 transition-opacity group-hover:opacity-100">
                            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" />
                        </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Task Actions">
                        <DropdownItem key="edit" onPress={() => onClick(task)}>
                            Edit
                        </DropdownItem>
                        <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            onPress={() => onDelete(task.id)}
                        >
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            {task.description && (
                <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                    {task.description}
                </p>
            )}

            <div className="mt-auto flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                    {(task.assignees || []).map((initial, i) => (
                        <Avatar
                            key={i}
                            name={initial}
                            size="sm"
                            className="h-6 w-6 border-2 border-white text-xs dark:border-zinc-800"
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                    {(task.comments || 0) > 0 && (
                        <div className="flex items-center gap-1">
                            <ChatBubbleLeftIcon className="h-3.5 w-3.5" />
                            <span>{task.comments}</span>
                        </div>
                    )}
                    {(task.attachments || 0) > 0 && (
                        <div className="flex items-center gap-1">
                            <PaperClipIcon className="h-3.5 w-3.5" />
                            <span>{task.attachments}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="absolute top-4 right-8">
                {/* Priority Dot */}
                <div
                    className={`h-2 w-2 rounded-full bg-${PRIORITIES[task.priority].color === 'danger' ? 'red' : PRIORITIES[task.priority].color === 'warning' ? 'yellow' : 'green'}-500`}
                />
            </div>
        </div>
    );
}

export function KanbanPage() {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState<Task[]>(getMockTasks());

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [formData, setFormData] = useState<Partial<Task>>({});

    // Delete State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

    // Search State
    const [search, setSearch] = useState('');

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns: Column[] = [
        { id: 'todo', title: 'kanban.columns.todo' },
        { id: 'inProgress', title: 'kanban.columns.inProgress' },
        { id: 'review', title: 'kanban.columns.review' },
        { id: 'done', title: 'kanban.columns.done' },
    ];

    const [activeId, setActiveId] = useState<number | null>(null);

    // Logic
    const filteredTasks = useMemo(() => {
        if (!search) return tasks;
        const lower = search.toLowerCase();
        return tasks.filter(
            (t) =>
                t.title.toLowerCase().includes(lower) ||
                t.description?.toLowerCase().includes(lower)
        );
    }, [tasks, search]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';

        if (!isActiveTask) return;

        // Dropping over a task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverColumn = over.data.current?.type === 'Column';

        // Dropping over a column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].columnId = overId as ColumnId;
                return arrayMove(tasks, activeIndex, activeIndex); // Refresh
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                }
                return arrayMove(tasks, activeIndex, overIndex);
            });
        } else if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].columnId = overId as ColumnId;
                return [...tasks];
            });
        }
    };

    const handleSave = () => {
        if (!formData.title) return;

        if (editingTask) {
            setTasks((prev) =>
                prev.map((t) => (t.id === editingTask.id ? ({ ...formData, id: t.id } as Task) : t))
            );
        } else {
            const newTask: Task = {
                id: Date.now(),
                columnId: 'todo',
                priority: 'medium',
                ...formData,
            } as Task;
            setTasks((prev) => [...prev, newTask]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        setTaskToDelete(id);
        setIsModalOpen(false);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (taskToDelete) {
            setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
        }
        setIsDeleteOpen(false);
        setTaskToDelete(null);
    };

    const openCreateModal = (columnId: ColumnId = 'todo') => {
        setEditingTask(undefined);
        setFormData({ columnId, priority: 'medium' });
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setFormData({ ...task });
        setIsModalOpen(true);
    };

    const activeTask = tasks.find((t) => t.id === activeId);

    return (
        <div className="flex h-[calc(100vh-6rem)] flex-col overflow-hidden">
            <PageHeader
                title={t('kanban.title')}
                breadcrumbs={[{ label: t('menu.workflow') }, { label: t('menu.kanban') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => openCreateModal()}
                        isIconOnlyMobile
                        startContent={<PlusIcon className="h-5 w-5 sm:h-4 sm:w-4" />}
                    >
                        {t('kanban.addTask')}
                    </Button>
                }
            />

            <div className="mb-4">
                <Input
                    placeholder={t('kanban.searchPlaceholder')}
                    value={search}
                    onValueChange={setSearch}
                    isClearable
                    className="w-full sm:max-w-xs"
                    startContent={<Bars2Icon className="h-4 w-4 rotate-90 text-gray-400" />}
                />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-full gap-3 overflow-x-auto pb-4 sm:gap-6">
                    {columns.map((col) => (
                        <div
                            key={col.id}
                            className="flex h-full min-w-70 flex-col rounded-xl bg-gray-50/50 p-3 sm:w-75 sm:min-w-75 sm:p-4 dark:bg-zinc-800/50"
                        >
                            <div className="mb-3 flex items-center justify-between sm:mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        {t(col.title)}
                                    </span>
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
                                        {filteredTasks.filter((t) => t.columnId === col.id).length}
                                    </span>
                                </div>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onPress={() => openCreateModal(col.id)}
                                >
                                    <PlusIcon className="h-4 w-4 text-gray-500" />
                                </Button>
                            </div>

                            <SortableContext
                                items={filteredTasks
                                    .filter((t) => t.columnId === col.id)
                                    .map((t) => t.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex flex-1 cursor-default flex-col gap-2 overflow-y-auto pr-1 sm:gap-3">
                                    {filteredTasks
                                        .filter((t) => t.columnId === col.id)
                                        .map((task) => (
                                            <SortableTask
                                                key={task.id}
                                                task={task}
                                                onClick={openEditModal}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                </div>
                            </SortableContext>
                        </div>
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <SortableTask task={activeTask} onClick={() => {}} onDelete={() => {}} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTask ? t('kanban.editTask') : t('kanban.addTask')}
                footer={
                    <>
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
                        label="Task Title"
                        value={formData.title || ''}
                        onValueChange={(val) => setFormData((p) => ({ ...p, title: val }))}
                        isRequired
                        variant="bordered"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Column"
                            selectedKeys={formData.columnId ? [formData.columnId] : []}
                            onSelectionChange={(k) =>
                                setFormData((p) => ({
                                    ...p,
                                    columnId: Array.from(k)[0] as ColumnId,
                                }))
                            }
                            variant="bordered"
                        >
                            {columns.map((c) => (
                                <SelectItem key={c.id}>{t(c.title)}</SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Priority"
                            selectedKeys={formData.priority ? [formData.priority] : []}
                            onSelectionChange={(k) =>
                                setFormData((p) => ({
                                    ...p,
                                    priority: Array.from(k)[0] as Priority,
                                }))
                            }
                            variant="bordered"
                        >
                            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                                <SelectItem
                                    key={p}
                                    startContent={
                                        <div
                                            className={`h-2 w-2 rounded-full bg-${PRIORITIES[p].color === 'danger' ? 'red' : PRIORITIES[p].color === 'warning' ? 'yellow' : 'green'}-500`}
                                        />
                                    }
                                >
                                    {t(PRIORITIES[p].label)}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <Input
                        label="Description"
                        value={formData.description || ''}
                        onValueChange={(val) => setFormData((p) => ({ ...p, description: val }))}
                        variant="bordered"
                    />
                </div>
            </Modal>

            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title={t('kanban.deleteConfirmTitle')}
                message={t('kanban.deleteConfirm')}
                confirmText={t('common.delete')}
                type="danger"
            />
        </div>
    );
}

function getMockTasks(): Task[] {
    return [
        {
            id: 1,
            title: 'Design System Update',
            description: 'Update color palette and typography tokens',
            columnId: 'done',
            priority: 'high',
            assignees: ['JD', 'AM'],
            comments: 2,
            attachments: 1,
        },
        {
            id: 2,
            title: 'Q3 Analytics Report',
            description: 'Compile monthly performance metrics',
            columnId: 'inProgress',
            priority: 'medium',
            assignees: ['TS'],
            comments: 5,
        },
        {
            id: 3,
            title: 'User Onboarding Flow',
            description: 'Redesign the initial setup wizard',
            columnId: 'todo',
            priority: 'high',
            assignees: ['JD'],
        },
        {
            id: 4,
            title: 'Fix Mobile Navigation',
            description: 'Menu not closing on selection',
            columnId: 'review',
            priority: 'low',
            assignees: ['AM'],
            attachments: 2,
        },
        {
            id: 5,
            title: 'API Optimization',
            description: 'Reduce response time for dashboard endpoints',
            columnId: 'todo',
            priority: 'medium',
        },
    ];
}
