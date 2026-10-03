import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import sonarjs from "eslint-plugin-sonarjs";

export default [
    {
        ignores: [
            ".next/**",
            "dist/**",
            "node_modules/**",
            "**/*.cjs",
            "next-env.d.ts",
            ".agents/**",
            ".heroui-docs/**",
            "scripts/**",
            "messages/**",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.strict,
    sonarjs.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "prefer-const": "error",
            "no-var": "error",
            "eqeqeq": ["error", "always"],
            "no-duplicate-imports": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-invalid-void-type": "off",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/ban-ts-comment": [
                "error",
                {
                    "ts-expect-error": "allow-with-description",
                    "ts-ignore": true,
                },
            ],
            "sonarjs/no-nested-conditional": "off",
            "sonarjs/pseudo-random": "error",
            "sonarjs/no-duplicate-string": "off",
            "sonarjs/max-switch-cases": "off",
            "sonarjs/todo-tag": "error",
            "sonarjs/use-type-alias": "warn",
            "sonarjs/no-duplicate-in-composite": "warn",
            "sonarjs/redundant-type-aliases": "warn",
            "sonarjs/concise-regex": "warn",
            "sonarjs/cognitive-complexity": ["warn", 25],
        },
    },
];
