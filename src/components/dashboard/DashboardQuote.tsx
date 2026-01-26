import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatBubbleBottomCenterTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import { Quote } from '@/types';

export function DashboardQuote() {
    const { t } = useTranslation();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);

    const loadQuote = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://dummyjson.com/quotes/random');
            const data: Quote = await res.json();
            setQuote(data);
        } catch (error) {
            console.error('Error loading quote:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuote();
    }, []);

    return (
        <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-lg">
            <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2 opacity-80">
                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                        <span className="text-sm font-medium tracking-wider uppercase">
                            {t('widgets.inspiration')}
                        </span>
                    </div>
                    {loading ? (
                        <div className="h-16 w-full max-w-2xl animate-pulse rounded-lg bg-white/20" />
                    ) : (
                        quote && (
                            <>
                                <p className="mb-2 font-serif text-xl leading-relaxed italic md:text-2xl">
                                    "{quote.quote}"
                                </p>
                                <p className="font-medium opacity-90">— {quote.author}</p>
                            </>
                        )
                    )}
                </div>
                <Button
                    isIconOnly
                    variant="light"
                    className="text-white hover:bg-white/20"
                    radius="full"
                    onPress={loadQuote}
                    isLoading={loading}
                >
                    <ArrowPathIcon className="h-5 w-5" />
                </Button>
            </div>

            {/* Background decoration */}
            <ChatBubbleBottomCenterTextIcon className="absolute -right-4 -bottom-4 h-32 w-32 rotate-12 text-white opacity-10" />
        </div>
    );
}
