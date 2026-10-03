/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
export default {
    plugins: [
        "@ianvs/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss", // Bắt buộc nằm cuối cùng trong danh sách plugins
    ],
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    trailingComma: "es5",
    printWidth: 100,

    // Cấu hình thứ tự sắp xếp Imports
    importOrder: [
        "^(react/(.*)$)|^(react$)",
        "^(next/(.*)$)|^(next$)",
        "<THIRD_PARTY_MODULES>",
        "^@/types/(.*)$",
        "^@/config/(.*)$",
        "^@/lib/(.*)$",
        "^@/hooks/(.*)$",
        "^@/services/(.*)$",
        "^@/components/common(.*)$",
        "^@/components/(.*)$",
        "^@/views/(.*)$",
        "^@/styles/(.*)$",
        "^@/app/(.*)$",
        "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderTypeScriptVersion: "5.0.0",

    // Cấu hình Tailwind CSS v4 class sorting
    tailwindStylesheet: "./src/index.css",
    tailwindFunctions: ["clsx", "cn", "twMerge"],
};
