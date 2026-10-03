import ClientPage from './client-page';

export function generateStaticParams() {
    return [{ slug: [] }];
}

export default function Page() {
    return <ClientPage />;
}
