import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import {
    ExclamationTriangleIcon,
    LockClosedIcon,
    ShieldExclamationIcon,
    ServerStackIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

// ==================== 404 NOT FOUND ====================
export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="text-center">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <h1 className="animate-pulse bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-[180px] leading-none font-black text-transparent select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 text-[180px] leading-none font-black text-purple-500/20 blur-2xl select-none">
                        404
                    </div>
                </div>

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-purple-500/20 p-4 backdrop-blur">
                        <ExclamationTriangleIcon className="h-16 w-16 text-purple-400" />
                    </div>
                </div>

                {/* Message */}
                <h2 className="mb-3 text-3xl font-bold text-white">Trang không tồn tại</h2>
                <p className="mx-auto mb-8 max-w-md text-lg text-gray-400">
                    Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Button
                        color="default"
                        variant="bordered"
                        radius="full"
                        size="lg"
                        startContent={<ArrowLeftIcon className="h-5 w-5" />}
                        onPress={() => navigate(-1)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Quay lại
                    </Button>
                    <Button
                        color="secondary"
                        radius="full"
                        size="lg"
                        startContent={<HomeIcon className="h-5 w-5" />}
                        onPress={() => navigate('/')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ==================== 401 UNAUTHORIZED ====================
export function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            <div className="text-center">
                {/* Animated 401 */}
                <div className="relative mb-8">
                    <h1 className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-[180px] leading-none font-black text-transparent select-none">
                        401
                    </h1>
                    <div className="absolute inset-0 text-[180px] leading-none font-black text-blue-500/20 blur-2xl select-none">
                        401
                    </div>
                </div>

                {/* Icon with lock animation */}
                <div className="mb-6 flex justify-center">
                    <div className="animate-bounce rounded-full bg-blue-500/20 p-4 backdrop-blur">
                        <LockClosedIcon className="h-16 w-16 text-blue-400" />
                    </div>
                </div>

                {/* Message */}
                <h2 className="mb-3 text-3xl font-bold text-white">Chưa đăng nhập</h2>
                <p className="mx-auto mb-8 max-w-md text-lg text-gray-400">
                    Bạn cần đăng nhập để truy cập trang này. Vui lòng đăng nhập và thử lại.
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Button
                        color="default"
                        variant="bordered"
                        radius="full"
                        size="lg"
                        startContent={<ArrowLeftIcon className="h-5 w-5" />}
                        onPress={() => navigate(-1)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Quay lại
                    </Button>
                    <Button
                        color="primary"
                        radius="full"
                        size="lg"
                        startContent={<LockClosedIcon className="h-5 w-5" />}
                        onPress={() => navigate('/login')}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500"
                    >
                        Đăng nhập
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ==================== 403 FORBIDDEN ====================
export function ForbiddenPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-4">
            <div className="text-center">
                {/* Animated 403 */}
                <div className="relative mb-8">
                    <h1 className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-[180px] leading-none font-black text-transparent select-none">
                        403
                    </h1>
                    <div className="absolute inset-0 text-[180px] leading-none font-black text-orange-500/20 blur-2xl select-none">
                        403
                    </div>
                </div>

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-orange-500/20 p-4 backdrop-blur">
                        <ShieldExclamationIcon className="h-16 w-16 text-orange-400" />
                    </div>
                </div>

                {/* Message */}
                <h2 className="mb-3 text-3xl font-bold text-white">Không có quyền truy cập</h2>
                <p className="mx-auto mb-8 max-w-md text-lg text-gray-400">
                    Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu cần hỗ
                    trợ.
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Button
                        color="default"
                        variant="bordered"
                        radius="full"
                        size="lg"
                        startContent={<ArrowLeftIcon className="h-5 w-5" />}
                        onPress={() => navigate(-1)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Quay lại
                    </Button>
                    <Button
                        color="warning"
                        radius="full"
                        size="lg"
                        startContent={<HomeIcon className="h-5 w-5" />}
                        onPress={() => navigate('/')}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    >
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ==================== 500 SERVER ERROR ====================
export function ServerErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4">
            <div className="text-center">
                {/* Animated 500 */}
                <div className="relative mb-8">
                    <h1 className="animate-pulse bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 bg-clip-text text-[180px] leading-none font-black text-transparent select-none">
                        500
                    </h1>
                    <div className="absolute inset-0 text-[180px] leading-none font-black text-red-500/20 blur-2xl select-none">
                        500
                    </div>
                </div>

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-red-500/20 p-4 backdrop-blur">
                        <ServerStackIcon className="h-16 w-16 text-red-400" />
                    </div>
                </div>

                {/* Message */}
                <h2 className="mb-3 text-3xl font-bold text-white">Lỗi máy chủ</h2>
                <p className="mx-auto mb-8 max-w-md text-lg text-gray-400">
                    Đã xảy ra lỗi từ phía máy chủ. Đội ngũ kỹ thuật đang khắc phục. Vui lòng thử lại
                    sau.
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Button
                        color="default"
                        variant="bordered"
                        radius="full"
                        size="lg"
                        startContent={<ArrowLeftIcon className="h-5 w-5" />}
                        onPress={() => window.location.reload()}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Thử lại
                    </Button>
                    <Button
                        color="danger"
                        radius="full"
                        size="lg"
                        startContent={<HomeIcon className="h-5 w-5" />}
                        onPress={() => navigate('/')}
                        className="bg-gradient-to-r from-red-500 to-rose-500"
                    >
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}
