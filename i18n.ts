import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;
    if (!locale) {
        locale = "vi";
    }

    const rawMessages = (await import(`./src/locales/${locale}.json`)).default;
    // Unwrap the "translation" key if it exists (from i18next format)
    const messages = rawMessages.translation ? rawMessages.translation : rawMessages;

    return {
        locale,
        messages,
        timeZone: "Asia/Ho_Chi_Minh",
        now: new Date(),
        getMessageFallback({ namespace, key, error: _error }) {
            const path = [namespace, key].filter((part) => part !== null && part !== undefined).join('.');
            return path;
        },
        onError(_error) {
            // Ignore missing messages
        }
    };
});
