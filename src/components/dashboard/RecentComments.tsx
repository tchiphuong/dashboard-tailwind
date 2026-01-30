import { useTranslation } from 'react-i18next';
import { User } from '@heroui/react';
import { Comment } from '@/types';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface RecentCommentsProps {
    comments: Comment[];
}

export function RecentComments({ comments }: RecentCommentsProps) {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5 text-indigo-500" />
                {t('widgets.recentFeedback')}
            </h3>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-zinc-700/50 dark:hover:bg-gray-700"
                    >
                        <div className="flex items-start gap-3">
                            <User
                                name={comment.user.username}
                                description={`@${comment.user.username}`}
                                avatarProps={{
                                    src: `https://i.pravatar.cc/150?u=${comment.user.id}`,
                                    size: 'sm',
                                }}
                                className="flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-sm text-gray-600 italic dark:text-gray-300">
                                    "{comment.body}"
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
