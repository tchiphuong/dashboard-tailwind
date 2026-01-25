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
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-orange-500" />
                {t('widgets.pendingTasks')}
            </h3>
            <div className="space-y-2">
                {todos.map((todo) => (
                    <div key={todo.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-orange-500'}`} />
                            <span className={`text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>
                                {todo.todo}
                            </span>
                        </div>
                        {todo.completed ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                            <Chip size="sm" color="warning" variant="flat" className="text-xs h-6">
                                {t('widgets.pending')}
                            </Chip>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
