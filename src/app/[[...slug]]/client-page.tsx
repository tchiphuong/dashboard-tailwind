'use client';

import dynamic from 'next/dynamic';

const NextClientApp = dynamic(() => import('@/NextClientApp'), {
    ssr: false,
});

export default function ClientPage() {
    return <NextClientApp />;
}
