"use client";

import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

export function IntlProvider({ messages, locale, children }: { messages: any, locale: string, children: React.ReactNode }) {
    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            getMessageFallback={({ namespace, key, error: _error }) => {
                return [namespace, key].filter((part) => part !== null && part !== undefined).join('.');
            }}
            onError={(_error) => {
                // Ignore missing messages
            }}
        >
            {children}
        </NextIntlClientProvider>
    );
}
