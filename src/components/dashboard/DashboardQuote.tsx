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
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 shadow-lg text-white mb-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">{t('widgets.inspiration')}</span>
                    </div>
                    {loading ? (
                        <div className="h-16 animate-pulse bg-white/20 rounded-lg w-full max-w-2xl" />
                    ) : (
                        quote && (
                            <>
                                <p className="text-xl md:text-2xl font-serif italic leading-relaxed mb-2">
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
                    <ArrowPathIcon className="w-5 h-5" />
                </Button>
            </div>

            {/* Background decoration */}
            <ChatBubbleBottomCenterTextIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10 rotate-12" />
        </div>
    );
}
