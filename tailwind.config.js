module.exports = {
    // content: ["src/**/*.{html,js}", "assets/**/*.js"],
    // content: ["./node_modules/flyonui/dist/js/*.js"],
    // content: ["./node_modules/flyonui/dist/js/accordion.js"],
    content: ["*.html", "./app/views/**/*.html", "./app/controllers/**/*.js"],
    darkMode: "class", // Bật chế độ dark mode bằng lớp
    theme: {
        fontFamily: {
            sans: ["Inter", "sans-serif"],
            serif: ["Inter", "serif"],
        },
        extend: {},
    },
    plugins: [],
};
