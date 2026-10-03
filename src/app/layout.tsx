import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { IntlProvider } from './intl-provider';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from './providers';
import '../index.css';

const inter = Inter({
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Dashboard Tailwind',
    description: 'React dashboard converted to Next.js',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            className={inter.variable}
            data-scrollbar="thin"
        >
            <body className="bg-background text-foreground antialiased">
                <IntlProvider locale={locale} messages={messages}>
                    <Providers>{children}</Providers>
                </IntlProvider>
            </body>
        </html>
    );
}
