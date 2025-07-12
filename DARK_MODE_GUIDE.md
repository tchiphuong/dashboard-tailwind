# Dark Mode Implementation Guide - Tailwind CSS

## Tổng quan

Dashboard đã được tích hợp dark mode sử dụng **Tailwind CSS's built-in dark mode** với style tham khảo từ Facebook:

- **Alpine.js** để quản lý state
- **Tailwind CSS** với `darkMode: "class"` configuration
- **localStorage** để lưu trữ preference
- **Smooth transitions** cho tất cả elements

## Cách hoạt động

### 1. Toggle Dark Mode

- Click vào nút moon/sun icon ở header
- State được lưu vào localStorage
- Class `dark` được thêm/xóa khỏi `document.documentElement`

### 2. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
    darkMode: "class", // Sử dụng class thay vì media query
    // ...
};
```

### 3. Màu sắc Facebook Style

- **Background chính**: `bg-white` → `dark:bg-gray-800`
- **Background phụ**: `bg-gray-50` → `dark:bg-gray-700`
- **Background hover**: `bg-gray-100` → `dark:bg-gray-600`
- **Text chính**: `text-gray-700` → `dark:text-gray-200`
- **Text phụ**: `text-gray-500` → `dark:text-gray-400`

### 4. Color Variants

Mỗi màu có variants:

- **Light mode**: `bg-{color}-50`, `text-{color}-600`, `border-{color}-200`
- **Dark mode**: `dark:bg-{color}-900`, `dark:text-{color}-400`, `dark:border-{color}-700`

## Cấu trúc Files

```
tailwind.config.js                           # Dark mode configuration
app/views/dashboard/overview.html            # Dashboard với dark mode classes
app/controllers/dashboard-overview-controller.js # Helper functions
index.html                                   # Alpine.js setup & toggle button
```

## Cách sử dụng

### 1. Thêm Dark Mode Classes

```html
<!-- Background -->
<div class="bg-white dark:bg-gray-800">
    <!-- Text -->
    <p class="text-gray-700 dark:text-gray-200">
        <!-- Borders -->
    </p>

    <div class="border border-gray-200 dark:border-gray-600">
        <!-- Hover states -->
        <button class="hover:bg-gray-100 dark:hover:bg-gray-700"></button>
    </div>
</div>
```

### 2. Color Variants

```html
<!-- Blue variant -->
<div class="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
    <!-- Green variant -->
    <div
        class="bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-400"
    >
        <!-- Custom colors -->
        <div
            class="bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
        ></div>
    </div>
</div>
```

### 3. Helper Functions (Controller)

```javascript
// Badge classes
$scope.getActivityBadgeClasses = function (color) {
    const colorMap = {
        blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
        green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
        // ...
    };
    return (
        colorMap[color] ||
        "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
    );
};

// Icon classes
$scope.getActivityIconClasses = function (color) {
    const colorMap = {
        blue: "text-blue-500 dark:text-blue-400",
        green: "text-green-500 dark:text-green-400",
        // ...
    };
    return colorMap[color] || "text-gray-500 dark:text-gray-400";
};
```

## Components đã được cập nhật

### 1. Stats Cards

- Background gradient với border
- Icon colors với dark variants
- Text colors với dark variants
- Animated background elements

### 2. Quick Actions

- Button backgrounds với color variants
- Hover states
- Border styling
- Icon colors

### 3. Notifications

- Background colors theo type
- Border styling
- Text colors

### 4. Charts

- Container styling
- Chart.js sẽ tự động invert colors

### 5. Progress Bars

- Background track colors
- Progress fill colors
- Text colors

### 6. Data Tables

- Grid.js styling
- Header/row colors
- Hover states
- Pagination styling

### 7. Timeline

- Timeline line colors
- Dot colors
- Text colors
- Badge styling

## Best Practices

### 1. Color Consistency

- Luôn sử dụng cùng một set màu cho light/dark mode
- Sử dụng Tailwind's built-in color palette
- Đảm bảo contrast ratio đủ cao

### 2. Transitions

- Thêm `transition-colors duration-300` cho smooth transitions
- Sử dụng `ease-in-out` cho natural feel

### 3. Accessibility

- Đảm bảo contrast ratio tối thiểu 4.5:1
- Test với screen readers
- Keyboard navigation support

### 4. Performance

- Sử dụng Tailwind's utility classes
- Minimize reflows/repaints
- Use transform/opacity cho animations

## Tailwind Configuration

```javascript
module.exports = {
    content: ["*.html", "./app/views/**/*.html", "./app/controllers/*.js"],
    darkMode: "class", // Enable class-based dark mode
    theme: {
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
```

## Troubleshooting

### 1. Dark mode không hoạt động

- Kiểm tra `darkMode: "class"` trong tailwind.config.js
- Kiểm tra Alpine.js đã load chưa
- Kiểm tra localStorage có bị block không
- Console errors

### 2. Colors không đúng

- Kiểm tra CSS specificity
- Đảm bảo dark mode classes được apply
- Kiểm tra Tailwind safelist có include color variants

### 3. Transitions không smooth

- Đảm bảo có `transition-colors`
- Kiểm tra GPU acceleration
- Avoid layout shifts

## Future Enhancements

1. **System preference detection**: Auto-detect OS dark mode
2. **Custom color themes**: User-defined color schemes
3. **Animation improvements**: More sophisticated transitions
4. **Accessibility improvements**: High contrast mode
5. **Performance optimizations**: Critical CSS

## Browser Support

- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

## Dependencies

- Alpine.js 3.x
- Tailwind CSS 3.x (with dark mode enabled)
- Modern browser với CSS custom properties support

## Lợi ích của Tailwind's Built-in Dark Mode

1. **Consistency**: Sử dụng cùng color palette
2. **Performance**: Không cần custom CSS
3. **Maintainability**: Dễ dàng update và maintain
4. **Tree-shaking**: Chỉ include classes được sử dụng
5. **Responsive**: Hoạt động với responsive variants
