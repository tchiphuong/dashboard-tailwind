'use client';

import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import App from './App';

/**
 * PathSync chỉ đồng bộ đúng 1 lần duy nhất khi component mount lần đầu.
 * Sau đó, React Router DOM tự quản lý toàn bộ điều hướng SPA.
 */
function PathSync({ targetPath }: Readonly<{ targetPath?: string }>) {
    const navigate = useNavigate();
    const location = useLocation();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!hasSynced.current && targetPath && targetPath !== location.pathname) {
            hasSynced.current = true;
            navigate(targetPath, { replace: true });
        }
    }, [targetPath, location.pathname, navigate]);

    return null;
}

export default function NextClientApp({ pathname }: Readonly<{ pathname?: string }>) {
    return (
        <BrowserRouter>
            <PathSync targetPath={pathname} />
            <App />
        </BrowserRouter>
    );
}
