import NextClientApp from '@/NextClientApp';

export function generateStaticParams() {
    return [{ slug: [] }];
}

export default function Page() {
    return <NextClientApp />;
}
