'use client';

import type { Comment } from '@/types';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { Avatar, Card } from '@/components/common';

interface RecentCommentsProps {
    comments: Comment[];
}

export function RecentComments({ comments }: Readonly<RecentCommentsProps>) {
    const t = useTranslations();

    return (
        <Card className="relative overflow-hidden border border-b-4 border-indigo-500 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-indigo-500 dark:bg-zinc-900/90">
            <Card.Header
                icon={<ChatBubbleLeftRightIcon className="size-4" />}
                iconColor="indigo"
                title={t('widgets.recentFeedback')}
                action={
                    <span className="text-[0.6875rem] text-zinc-400 tabular-nums">
                        {comments.length} phản hồi
                    </span>
                }
            />

            <div className="space-y-3">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/70"
                    >
                        <div className="flex items-start gap-3">
                            <Avatar size="sm" className="shrink-0 bg-indigo-500/10 text-indigo-600">
                                <Avatar.Image
                                    src={`https://i.pravatar.cc/150?u=${comment.user.id}`}
                                    alt={comment.user.username}
                                />
                                <Avatar.Fallback>
                                    {comment.user.username.slice(0, 2).toUpperCase()}
                                </Avatar.Fallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="truncate text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                        @{comment.user.username}
                                    </span>
                                </div>
                                <p className="line-clamp-2 text-xs text-zinc-600 italic dark:text-zinc-300">
                                    "{comment.body}"
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
