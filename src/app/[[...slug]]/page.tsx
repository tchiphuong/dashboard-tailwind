'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const NextClientApp = dynamic(() => import('@/NextClientApp'), {
    ssr: false,
});

export default function Page() {
    const pathname = usePathname();
    return <NextClientApp pathname={pathname} />;
}
