'use client';

import React, { useState } from 'react';
import {
    Card,
    Button,
    Input,
    Modal,
    Alert,
} from '@/components/common';
import {
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    BookOpenIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    ShoppingBagIcon,
    PhoneIcon,
    EnvelopeIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

interface FaqItem {
    id: string;
    category: string;
    question: string;
    answer: string;
}

const FAQ_LIST: FaqItem[] = [
    {
        id: 'faq-1',
        category: 'getting-started',
        question: 'Làm thế nào để bắt đầu sử dụng hệ thống Dashboard Tailwind?',
        answer: 'Sau khi đăng nhập với tài khoản được cấp quyền, anh có thể vào mục Dashboard để xem tổng quan các chỉ số kinh doanh, hoặc truy cập menu bên trái để điều hướng đến các phân hệ Bán hàng, Tài chính, Kho vận hoặc Nhân sự.',
    },
    {
        id: 'faq-2',
        category: 'finance',
        question: 'Chức năng tạo mã VietQR và kiểm tra tỷ giá có phát sinh giao dịch thật không?',
        answer: 'Tuyệt đối không! Toàn bộ phân hệ tài chính và mã VietQR đều hoạt động ở chế độ THỬ NGHIỆM (DEMO ONLY) nhằm phục vụ đào tạo và minh họa quy trình. Mọi mã QR đều có nhãn cảnh báo đỏ và tiền tố DEMO-, hệ thống cấm mọi hành vi giao dịch tiền thật.',
    },
    {
        id: 'faq-3',
        category: 'security',
        question: 'Tôi có thể xem lịch sử đăng nhập và các sự kiện bảo mật ở đâu?',
        answer: 'Anh có thể truy cập phân hệ Hệ thống > Nhật ký hoạt động (Audit Logs) để tra cứu đầy đủ thông tin: địa chỉ IP, vị trí địa lý Geolocation (tích hợp qua Cổng Geolocation), thiết bị truy cập và trạng thái an toàn của từng phiên làm việc.',
    },
    {
        id: 'faq-4',
        category: 'sales',
        question: 'Làm thế nào để xuất danh sách đơn hàng hoặc hóa đơn ra file?',
        answer: 'Tại mỗi bảng dữ liệu (như Hóa đơn, Ngân sách, Đơn hàng), hệ thống đều cung cấp nút "Xuất file" (CSV / JSON / Excel) ở góc trên bên phải để tải dữ liệu thống kê về máy tính an toàn.',
    },
    {
        id: 'faq-5',
        category: 'system',
        question: 'Hệ thống hỗ trợ những ngôn ngữ và giao diện hiển thị nào?',
        answer: 'Dashboard hỗ trợ song ngữ Tiếng Việt và Tiếng Anh (chuyển đổi tại thanh Header), cùng với 2 chế độ hiển thị Giao diện Sáng (Light Mode) và Giao diện Tối (Dark Mode) tối ưu cho mắt.',
    },
];

export function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [ticketTitle, setTicketTitle] = useState('');
    const [ticketCategory, setTicketCategory] = useState('KyThuat');
    const [ticketContent, setTicketContent] = useState('');
    const [ticketSuccessAlert, setTicketSuccessAlert] = useState(false);

    // Lọc FAQ theo từ khóa và danh mục
    const filteredFaqs = FAQ_LIST.filter((faq) => {
        const matchesQuery =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesQuery && matchesCategory;
    });

    const toggleFaq = (id: string) => {
        setExpandedFaqId((prev) => (prev === id ? null : id));
    };

    const handleSendTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketTitle.trim() || !ticketContent.trim()) return;

        setIsTicketModalOpen(false);
        setTicketSuccessAlert(true);
        setTicketTitle('');
        setTicketContent('');

        setTimeout(() => {
            setTicketSuccessAlert(false);
        }, 5000);
    };

    return (
        <div className="space-y-8">
            {/* Banner Tìm kiếm trung tâm */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-12 text-center text-white shadow-lg sm:px-12 sm:py-16">
                <div className="relative z-10 mx-auto max-w-2xl space-y-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                        <BookOpenIcon className="h-4 w-4" />
                        <span>Trung tâm trợ giúp & Hỗ trợ kỹ thuật</span>
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Anh cần hỗ trợ điều gì hôm nay?
                    </h1>
                    <p className="text-sm text-blue-100 sm:text-base">
                        Tìm kiếm câu trả lời nhanh chóng cho mọi thắc mắc về phân hệ, tài chính, đơn hàng hoặc gửi yêu cầu hỗ trợ trực tiếp.
                    </p>

                    <div className="pt-2">
                        <div className="relative mx-auto max-w-xl">
                            <input
                                type="text"
                                placeholder="Nhập từ khóa cần tìm: VietQR, hóa đơn, bảo mật, đổi mật khẩu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border-0 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 shadow-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <MagnifyingGlassIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {ticketSuccessAlert && (
                <Alert status="accent">
                    <div className="flex items-center justify-between">
                        <span>
                            Yêu cầu hỗ trợ của anh đã được tiếp nhận thành công! Đội ngũ kỹ thuật IT sẽ phản hồi trong vòng 15 phút.
                        </span>
                        <Button size="sm" variant="secondary" onClick={() => setTicketSuccessAlert(false)}>
                            Đã hiểu
                        </Button>
                    </div>
                </Alert>
            )}

            {/* 4 Nhóm chuyên mục hỗ trợ chính */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Chuyên mục hướng dẫn nổi bật
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card
                        className="cursor-pointer p-5 transition-transform hover:-translate-y-1 hover:shadow-md"
                        onClick={() => setSelectedCategory('getting-started')}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                            <BookOpenIcon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                            Khởi đầu nhanh
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Hướng dẫn đăng nhập, cấu hình tài khoản cá nhân và làm quen giao diện.
                        </p>
                    </Card>

                    <Card
                        className="cursor-pointer p-5 transition-transform hover:-translate-y-1 hover:shadow-md"
                        onClick={() => setSelectedCategory('finance')}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                            <CurrencyDollarIcon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                            Tài chính & VietQR
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Quy tắc demo mã QR 65 ngân hàng, tỷ giá ngoại tệ và quản lý hóa đơn.
                        </p>
                    </Card>

                    <Card
                        className="cursor-pointer p-5 transition-transform hover:-translate-y-1 hover:shadow-md"
                        onClick={() => setSelectedCategory('sales')}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                            <ShoppingBagIcon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                            Bán hàng & CRM
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Tạo đơn hàng, tra cứu địa chỉ 63 tỉnh thành và chăm sóc khách hàng.
                        </p>
                    </Card>

                    <Card
                        className="cursor-pointer p-5 transition-transform hover:-translate-y-1 hover:shadow-md"
                        onClick={() => setSelectedCategory('security')}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                            <ShieldCheckIcon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                            An ninh & Bảo mật
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Nhật ký Audit Logs, định vị IP truy cập và quy chuẩn an toàn dữ liệu.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Câu hỏi thường gặp (Accordion FAQ) */}
            <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Câu hỏi thường gặp (FAQ)
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Giải đáp nhanh các thắc mắc phổ biến nhất của các phòng ban.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {[
                            { key: 'all', label: 'Tất cả' },
                            { key: 'getting-started', label: 'Bắt đầu' },
                            { key: 'finance', label: 'Tài chính' },
                            { key: 'security', label: 'Bảo mật' },
                            { key: 'sales', label: 'Bán hàng' },
                        ].map((cat) => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                                    selectedCategory === cat.key
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => {
                            const isExpanded = expandedFaqId === faq.id;
                            return (
                                <Card key={faq.id} className="overflow-hidden transition-colors">
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(faq.id)}
                                        className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 dark:text-white"
                                    >
                                        <div className="flex items-center gap-3">
                                            <QuestionMarkCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                            <span className="text-sm font-semibold">{faq.question}</span>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 bg-gray-50/50 p-4 text-xs leading-relaxed text-gray-600 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-gray-300">
                                            {faq.answer}
                                        </div>
                                    )}
                                </Card>
                            );
                        })
                    ) : (
                        <Card className="p-8 text-center text-sm text-gray-500">
                            Không tìm thấy câu hỏi phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
                        </Card>
                    )}
                </div>
            </div>

            {/* Khối Liên hệ hỗ trợ trực tiếp */}
            <Card className="border border-blue-100 bg-blue-50/40 p-6 dark:border-blue-900/30 dark:bg-blue-950/20">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            Vẫn chưa tìm thấy thông tin anh cần?
                        </h3>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                            Đội ngũ Kỹ sư IT và Quản trị viên luôn sẵn sàng hỗ trợ trực tiếp cho anh.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="secondary"
                            className="flex items-center gap-2"
                            onClick={() => window.open('tel:19006868')}
                        >
                            <PhoneIcon className="h-4 w-4 text-emerald-600" />
                            <span>Hotline: 1900 6868</span>
                        </Button>
                        <Button
                            variant="primary"
                            className="flex items-center gap-2"
                            onClick={() => setIsTicketModalOpen(true)}
                        >
                            <EnvelopeIcon className="h-4 w-4" />
                            <span>Gửi yêu cầu hỗ trợ (Ticket)</span>
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Modal Gửi Ticket hỗ trợ */}
            <Modal
                isOpen={isTicketModalOpen}
                onClose={() => setIsTicketModalOpen(false)}
                title="Gửi yêu cầu hỗ trợ kỹ thuật (IT Ticket)"
            >
                <form onSubmit={handleSendTicket} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Tiêu đề yêu cầu:
                        </label>
                        <Input
                            placeholder="Ví dụ: Cần cấp quyền truy cập phân hệ Bán hàng..."
                            value={ticketTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTicketTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Phân hệ liên quan:
                        </label>
                        <select
                            value={ticketCategory}
                            onChange={(e) => setTicketCategory(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300"
                        >
                            <option value="KyThuat">Hạ tầng & Kỹ thuật mạng</option>
                            <option value="PhanQuyen">Phân quyền tài khoản</option>
                            <option value="TaiChinh">Tài chính & Hóa đơn</option>
                            <option value="BanHang">Bán hàng & Đơn hàng</option>
                            <option value="Khac">Vấn đề khác</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Mô tả chi tiết:
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Mô tả cụ thể vấn đề anh đang gặp phải để đội kỹ thuật xử lý nhanh nhất..."
                            value={ticketContent}
                            onChange={(e) => setTicketContent(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsTicketModalOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button variant="primary" type="submit" className="flex items-center gap-1.5">
                            <PaperAirplaneIcon className="h-4 w-4" />
                            <span>Gửi yêu cầu</span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
