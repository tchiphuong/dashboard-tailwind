'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Card,
    Button,
    Input,
} from '@/components/common';
import {
    HashtagIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    MagnifyingGlassIcon,
    PhoneIcon,
    VideoCameraIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

interface ChannelItem {
    id: string;
    name: string;
    description: string;
    unread: number;
}

interface MessageItem {
    id: string;
    senderId: string;
    senderName: string;
    avatar?: string;
    text: string;
    timestamp: string;
    isMe: boolean;
}

const INITIAL_CHANNELS: ChannelItem[] = [
    { id: 'general', name: 'thao-luan-chung', description: 'Kênh trao đổi nội bộ toàn công ty', unread: 0 },
    { id: 'sales', name: 'phong-kinh-doanh', description: 'Cập nhật đơn hàng và chỉ tiêu doanh số', unread: 3 },
    { id: 'finance', name: 'ke-toan-tai-chinh', description: 'Đối soát hóa đơn thuế và ngân sách', unread: 0 },
    { id: 'tech', name: 'ky-thuat-he-thong', description: 'Vận hành máy chủ, API Gateway và an ninh', unread: 1 },
];

const INITIAL_MESSAGES: MessageItem[] = [
    {
        id: 'msg-1',
        senderId: 'user-1',
        senderName: 'Lê Thị Thu Thảo (Kế toán)',
        text: 'Chào cả nhà, mình vừa đối soát xong số liệu quý 3/2026, tất cả hóa đơn đã được cập nhật lên hệ thống rồi nhé!',
        timestamp: '10:15',
        isMe: false,
    },
    {
        id: 'msg-2',
        senderId: 'user-2',
        senderName: 'Trần Minh Tâm (Sales)',
        text: 'Tuyệt vời Thảo ơi! Nhờ bên kỹ thuật kiểm tra xem API tỷ giá Vietcombank sáng nay đã đồng bộ mượt chưa để báo giá khách xuất khẩu.',
        timestamp: '10:18',
        isMe: false,
    },
    {
        id: 'msg-3',
        senderId: 'me',
        senderName: 'Tôi (Kỹ sư IT)',
        text: 'Dạ anh Tâm yên tâm nha, API tỷ giá trực tuyến đã cấu hình cron tự động cập nhật mỗi 30 phút, chạy mượt mà và có mock fallback an toàn 100% rồi anh!',
        timestamp: '10:22',
        isMe: true,
    },
];

export function ChatPage() {
    const t = useTranslations();
    const [channels] = useState<ChannelItem[]>(INITIAL_CHANNELS);
    const [activeChannelId, setActiveChannelId] = useState<string>('general');
    const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [searchUser, setSearchUser] = useState('');

    const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMsg: MessageItem = {
            id: `msg-${Date.now()}`,
            senderId: 'me',
            senderName: 'Tôi (Kỹ sư IT)',
            text: inputText.trim(),
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {t('menu.chat')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Trao đổi công việc nội bộ theo kênh phòng ban và tin nhắn trực tiếp thời gian thực.
                </p>
            </div>

            <Card className="flex h-[calc(100vh-220px)] min-h-[550px] overflow-hidden p-0">
                {/* Cột trái: Kênh chat & Thành viên */}
                <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50/50 dark:border-zinc-800 dark:bg-zinc-900/40 flex flex-col">
                    <div className="p-3 border-b border-gray-200 dark:border-zinc-800">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kênh hoặc đồng nghiệp..."
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
                            />
                            <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* Danh sách kênh */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2">
                                Kênh thảo luận ({channels.length})
                            </span>
                            <div className="mt-1.5 space-y-1">
                                {channels.map((ch) => (
                                    <button
                                        key={ch.id}
                                        type="button"
                                        onClick={() => setActiveChannelId(ch.id)}
                                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
                                            activeChannelId === ch.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <HashtagIcon className="h-4 w-4 flex-shrink-0 opacity-70" />
                                            <span className="truncate">{ch.name}</span>
                                        </div>
                                        {ch.unread > 0 && (
                                            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                                                {ch.unread}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Đồng nghiệp trực tuyến */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2">
                                Đang trực tuyến (4)
                            </span>
                            <div className="mt-1.5 space-y-2 px-1">
                                {[
                                    { name: 'Nguyễn Văn Hùng', role: 'Quản trị viên', status: 'online' },
                                    { name: 'Lê Thị Thu Thảo', role: 'Kế toán', status: 'online' },
                                    { name: 'Trần Minh Tâm', role: 'Sales Lead', status: 'busy' },
                                    { name: 'Hoàng Kim Oanh', role: 'Nhân sự', status: 'online' },
                                ].map((user) => (
                                    <div key={user.name} className="flex items-center gap-2.5">
                                        <div className="relative">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-600 dark:bg-zinc-800 dark:text-blue-400">
                                                {user.name.slice(0, 1)}
                                            </div>
                                            <span
                                                className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white dark:border-zinc-900 ${
                                                    user.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                                                }`}
                                            />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 truncate">{user.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Khung chat chính */}
                <div className="flex flex-1 flex-col bg-white dark:bg-zinc-900">
                    {/* Header kênh */}
                    <div className="flex h-14 items-center justify-between border-b border-gray-200 px-5 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <HashtagIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                                    {activeChannel.name}
                                </h2>
                                <p className="text-[11px] text-gray-400">
                                    {activeChannel.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                                <PhoneIcon className="h-4 w-4" />
                            </button>
                            <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                                <VideoCameraIcon className="h-4 w-4" />
                            </button>
                            <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                                <EllipsisVerticalIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Danh sách tin nhắn */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex items-start gap-3 ${m.isMe ? 'flex-row-reverse' : ''}`}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-zinc-800 dark:text-blue-300 flex-shrink-0">
                                    {m.senderName.slice(0, 1)}
                                </div>
                                <div className={`max-w-[70%] space-y-1 ${m.isMe ? 'text-right' : ''}`}>
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                                            {m.senderName}
                                        </span>
                                        <span className="text-gray-400">{m.timestamp}</span>
                                    </div>
                                    <div
                                        className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                                            m.isMe
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Khung nhập tin nhắn */}
                    <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800"
                                title="Đính kèm tệp"
                            >
                                <PaperClipIcon className="h-5 w-5" />
                            </button>

                            <div className="flex-1">
                                <Input
                                    placeholder={`Nhắn tin trong #${activeChannel.name}...`}
                                    value={inputText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                                />
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                isDisabled={!inputText.trim()}
                                className="flex items-center gap-1.5"
                            >
                                <PaperAirplaneIcon className="h-4 w-4" />
                                <span>Gửi</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
