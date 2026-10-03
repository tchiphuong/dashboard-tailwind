'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Quote } from '@/types';
import { ArrowPathIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { QuoteService } from '@/services/quote.service';
import { Button, Card } from '@/components/common';

export function DashboardQuote() {
    const t = useTranslations();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);

    const loadQuote = useCallback(async () => {
        setLoading(true);
        try {
            const res = await QuoteService.getRandom();
            if (res.data) {
                setQuote(res.data);
            }
        } catch (error) {
            console.error('Error loading quote:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadQuote();
    }, [loadQuote]);

    return (
        <Card className="relative mb-6 overflow-hidden border border-b-4 border-indigo-400 bg-linear-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-indigo-400 dark:from-blue-900/90 dark:via-indigo-900/90 dark:to-violet-950/90">
            {/* Background ambient pattern */}
            <div className="pointer-events-none absolute -right-6 -bottom-6 size-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -top-10 -left-10 size-40 rounded-full bg-indigo-400/20 blur-2xl" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2 text-blue-100">
                        <ChatBubbleBottomCenterTextIcon className="size-4 text-blue-200" />
                        <span className="text-xs font-bold tracking-wider uppercase">
                            {t('widgets.inspiration')}
                        </span>
                    </div>
                    {loading ? (
                        <div className="h-14 w-full max-w-2xl animate-pulse rounded-xl bg-white/15" />
                    ) : (
                        quote && (
                            <>
                                <p className="mb-2 font-serif text-lg leading-relaxed text-white/95 italic md:text-xl">
                                    "{quote.quote}"
                                </p>
                                <p className="text-xs font-semibold tracking-wide text-blue-100/90">
                                    — {quote.author}
                                </p>
                            </>
                        )
                    )}
                </div>
                <Button
                    isIconOnly
                    variant="ghost"
                    className="rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
                    onPress={loadQuote}
                    isDisabled={loading}
                    aria-label="Làm mới câu nói truyền cảm hứng"
                >
                    <ArrowPathIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
        </Card>
    );
}
