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
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-indigo-500" />
                {t('widgets.recentFeedback')}
            </h3>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-start gap-3">
                            <User
                                name={comment.user.username}
                                description={`@${comment.user.username}`}
                                avatarProps={{
                                    src: `https://i.pravatar.cc/150?u=${comment.user.id}`,
                                    size: "sm"
                                }}
                                className="flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 italic">
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
