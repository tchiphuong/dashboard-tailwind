/** @type {import("prettier").Config} */
export default {
    plugins: ["prettier-plugin-tailwindcss"],
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    trailingComma: "es5",
    printWidth: 100,
    // Tailwind CSS class sorting
    tailwindFunctions: ["clsx", "cn", "twMerge"],
};
