import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en.json';
import vi from '@/locales/vi.json';
import ja from '@/locales/ja.json';
import zh from '@/locales/zh.json';
import th from '@/locales/th.json';
import ko from '@/locales/ko.json';

const resources = {
    en,
    vi,
    ja,
    zh,
    th,
    ko,
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
