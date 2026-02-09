import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Card, CardBody, SelectItem } from '@heroui/react';
import { PlusIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { PageHeader, Modal as CommonModal, Input, Select } from '@/components/common';
import { mockSocialPosts } from './shared';

export function SocialMediaPage() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getPlatformIcon = (platform: string) => {
        const colors: Record<string, string> = {
            facebook: 'text-blue-600',
            instagram: 'text-pink-600',
            twitter: 'text-sky-500',
            linkedin: 'text-blue-700',
            tiktok: 'text-black dark:text-white',
        };
        return <GlobeAltIcon className={`h-5 w-5 ${colors[platform]}`} />;
    };

    return (
        <>
            <PageHeader
                title={t('menu.socialMedia')}
                breadcrumbs={[{ label: t('menu.group.marketing') }, { label: 'Mạng xã hội' }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo bài viết
                    </Button>
                }
            />
            {/* Platform stats */}
            <div className="mb-6 grid grid-cols-5 gap-4">
                {['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'].map((platform) => {
                    const posts = mockSocialPosts.filter((p) => p.platform === platform);
                    const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
                    return (
                        <Card key={platform}>
                            <CardBody className="p-4 text-center">
                                <div className="mb-2 flex justify-center">
                                    {getPlatformIcon(platform)}
                                </div>
                                <p className="font-bold capitalize">{platform}</p>
                                <p className="text-sm text-gray-500">
                                    {posts.length} bài • {totalLikes} likes
                                </p>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
            {/* Posts grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockSocialPosts.map((post) => (
                    <Card key={post.id}>
                        <CardBody className="p-4">
                            <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    {getPlatformIcon(post.platform)}
                                    <span className="font-medium capitalize">{post.platform}</span>
                                </div>
                                <Chip
                                    size="sm"
                                    color={
                                        post.status === 'published'
                                            ? 'success'
                                            : post.status === 'scheduled'
                                              ? 'warning'
                                              : 'default'
                                    }
                                    variant="flat"
                                >
                                    {post.status === 'published'
                                        ? 'Đã đăng'
                                        : post.status === 'scheduled'
                                          ? 'Lên lịch'
                                          : 'Nháp'}
                                </Chip>
                            </div>
                            <p className="mb-3 line-clamp-2 text-sm">{post.content}</p>
                            {post.status === 'published' && (
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <span>❤️ {post.likes}</span>
                                    <span>💬 {post.comments}</span>
                                    <span>↗️ {post.shares}</span>
                                </div>
                            )}
                            {post.status === 'scheduled' && post.scheduledAt && (
                                <p className="text-xs text-gray-500">
                                    Lên lịch:{' '}
                                    {new Date(post.scheduledAt).toLocaleDateString('vi-VN')}
                                </p>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tạo bài viết mới"
            >
                <div className="flex flex-col gap-4">
                    <Select
                        label="Nền tảng"
                        variant="bordered"
                        radius="lg"
                        selectionMode="multiple"
                    >
                        <SelectItem key="facebook">Facebook</SelectItem>
                        <SelectItem key="instagram">Instagram</SelectItem>
                        <SelectItem key="twitter">Twitter</SelectItem>
                        <SelectItem key="linkedin">LinkedIn</SelectItem>
                        <SelectItem key="tiktok">TikTok</SelectItem>
                    </Select>
                    <Input
                        label="Nội dung"
                        placeholder="Viết nội dung bài viết..."
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        type="datetime-local"
                        label="Lên lịch đăng"
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}
