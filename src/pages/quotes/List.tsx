import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardBody, CardFooter, Pagination } from '@heroui/react';
import { ArrowPathIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { Quote } from '@/types';

interface QuotesResponse {
    quotes: Quote[];
    total: number;
    skip: number;
    limit: number;
}

export function QuotesList() {
    const { t } = useTranslation();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(12); // Use 12 for better grid layout (3x4 or 4x3)

    const loadQuotes = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;
            const res = await fetch(`https://dummyjson.com/quotes?limit=${limit}&skip=${skip}`);
            const data: QuotesResponse = await res.json();
            setQuotes(data.quotes);
            setTotal(data.total);
        } catch (error) {
            console.error('Error loading quotes:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        loadQuotes();
    }, [loadQuotes]);

    const totalPages = Math.ceil(total / limit);

    return (
        <>
            <Breadcrumb items={[{ label: t('menu.quotes') }]} />

            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('pages.quotes')}
                </h1>
                <Button
                    variant="bordered"
                    onPress={loadQuotes}
                    isLoading={loading}
                    className="font-medium"
                    radius="full"
                    startContent={!loading && <ArrowPathIcon className="w-4 h-4" />}
                >
                    {t('common.refresh')}
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <ArrowPathIcon className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {quotes.map((quote) => (
                        <Card key={quote.id} className="p-4" shadow="sm">
                            <CardBody>
                                <div className="flex gap-4">
                                    <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
                                    <p className="text-gray-700 dark:text-gray-200 text-lg font-medium italic">
                                        "{quote.quote}"
                                    </p>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold ml-auto">
                                    — {quote.author}
                                </p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {totalPages > 0 && (
                <div className="flex justify-center pb-8">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={totalPages}
                        onChange={setPage}
                        radius="full"
                    />
                </div>
            )}
        </>
    );
}
