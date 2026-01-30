import { useTranslation } from 'react-i18next';
import { Todo } from '@/types';
import { CheckCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { Chip } from '@heroui/react';

interface TodoListWidgetProps {
    todos: Todo[];
}

export function TodoListWidget({ todos }: TodoListWidgetProps) {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <ClipboardDocumentListIcon className="mr-2 h-5 w-5 text-orange-500" />
                {t('widgets.pendingTasks')}
            </h3>
            <div className="space-y-2">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`h-2 w-2 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-orange-500'}`}
                            />
                            <span
                                className={`text-sm ${todo.completed ? 'text-gray-400 line-through' : 'font-medium text-gray-700 dark:text-gray-300'}`}
                            >
                                {todo.todo}
                            </span>
                        </div>
                        {todo.completed ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                            <Chip size="sm" color="warning" variant="flat" className="h-6 text-xs">
                                {t('widgets.pending')}
                            </Chip>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
