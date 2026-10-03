import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { IntlProvider } from './intl-provider';
import { Providers } from './providers';
import viMessages from '../locales/vi.json';
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

const rawMessages = viMessages as Record<string, unknown>;
const messages = (rawMessages.translation || rawMessages) as Record<string, string>;
const locale = 'vi';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
