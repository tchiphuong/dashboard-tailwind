import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Card, CardBody, Divider } from '@heroui/react';
import {
    BookOpenIcon,
    ChevronRightIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, Input } from '@/components/common';
import { KnowledgeArticle, mockKnowledge } from './shared';

export function KnowledgeBasePage() {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

    const categories = [...new Set(mockKnowledge.map((k) => k.category))];
    const filteredArticles = selectedCategory
        ? mockKnowledge.filter((k) => k.category === selectedCategory)
        : mockKnowledge;

    return (
        <>
            <PageHeader
                title={t('menu.knowledgeBase')}
                breadcrumbs={[{ label: t('menu.group.it') }, { label: 'Cơ sở tri thức' }]}
            />
            <div className="grid grid-cols-4 gap-6">
                <Card className="col-span-1">
                    <CardBody className="p-4">
                        <h4 className="mb-4 flex items-center gap-2 font-bold">
                            <BookOpenIcon className="h-5 w-5" /> Danh mục
                        </h4>
                        <div className="space-y-1">
                            <div
                                className={`cursor-pointer rounded-lg p-2 ${!selectedCategory ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Tất cả ({mockKnowledge.length})
                            </div>
                            {categories.map((cat) => (
                                <div
                                    key={cat}
                                    className={`cursor-pointer rounded-lg p-2 ${selectedCategory === cat ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat} ({mockKnowledge.filter((k) => k.category === cat).length})
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
                <div className="col-span-3">
                    {selectedArticle ? (
                        <Card>
                            <CardBody className="p-6">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onPress={() => setSelectedArticle(null)}
                                    className="mb-4"
                                >
                                    ← Quay lại
                                </Button>
                                <h2 className="mb-4 text-2xl font-bold">{selectedArticle.title}</h2>
                                <div className="mb-6 flex gap-4 text-sm text-gray-500">
                                    <span>📁 {selectedArticle.category}</span>
                                    <span>👁 {selectedArticle.views} lượt xem</span>
                                    <span>👍 {selectedArticle.helpful} hữu ích</span>
                                    <span>✍️ {selectedArticle.author}</span>
                                </div>
                                <Divider className="mb-6" />
                                <div className="prose dark:prose-invert max-w-none">
                                    <p>{selectedArticle.content}</p>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                        do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                        ullamco laboris.
                                    </p>
                                    <h3>Bước 1: Chuẩn bị</h3>
                                    <p>Nội dung hướng dẫn chi tiết bước 1...</p>
                                    <h3>Bước 2: Thực hiện</h3>
                                    <p>Nội dung hướng dẫn chi tiết bước 2...</p>
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                placeholder="Tìm kiếm bài viết..."
                                startContent={
                                    <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
                                }
                                variant="bordered"
                                radius="lg"
                            />
                            <div className="grid grid-cols-1 gap-4">
                                {filteredArticles.map((article) => (
                                    <Card
                                        key={article.id}
                                        isPressable
                                        onPress={() => setSelectedArticle(article)}
                                        className="transition-shadow hover:shadow-lg"
                                    >
                                        <CardBody className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="mb-1 text-lg font-bold">
                                                        {article.title}
                                                    </h3>
                                                    <div className="flex gap-4 text-sm text-gray-500">
                                                        <Chip size="sm" variant="flat">
                                                            {article.category}
                                                        </Chip>
                                                        <span>👁 {article.views}</span>
                                                        <span>👍 {article.helpful}</span>
                                                    </div>
                                                </div>
                                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
