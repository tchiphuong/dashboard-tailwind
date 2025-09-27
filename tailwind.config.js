module.exports = {
    content: [
        "*.html",
        "./app/views/**/*.html",
        "./app/controllers/*.js",
        "./assets/css/select2-tailwind.css",
    ],
    darkMode: "class",
    theme: {
        fontFamily: {
            sans: ["Inter", "sans-serif"],
            serif: ["Inter", "serif"],
        },
        extend: {},
    },
    safelist: [
        {
            pattern:
                /^(border|ring|outline|bg|text)-(red|blue|green|yellow|purple|pink|indigo|gray|teal|lime|orange|cyan)-(50|100|200|300|400|500|600|700|800|900)$/,
            variants: ["hover", "focus", "dark"],
        },
    ],
    plugins: [],
};
