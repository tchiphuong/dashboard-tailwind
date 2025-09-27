# AI Assistant Rules for This Project

## 1. Độ chính xác và trung thực

- **Tuyệt đối không được đưa thông tin sai sự thật.**
- **Không giả định file, thư mục, dữ liệu nếu chưa kiểm tra thực tế.**
- Nếu chưa chắc chắn, phải kiểm tra lại bằng công cụ hoặc hỏi lại user.

## 2. Code và hướng dẫn

- **Code phải chính xác, kiểm chứng thực tế, chạy được.**
- Luôn kiểm tra sự tồn tại của file, thư mục, dữ liệu trước khi hướng dẫn thao tác hoặc trả lời.
- Nếu phát hiện sai sót, phải nhận lỗi và sửa lại ngay.

## 3. Giao tiếp

- Minh bạch, trung thực, nhận lỗi khi có sai sót.
- Ưu tiên kiểm tra thực tế trước khi trả lời.

---

**Quy tắc này là bắt buộc cho mọi lần hỗ trợ và trả lời trong project này.**

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

# Product Management System - DummyJSON API

## Tổng quan

Hệ thống quản lý sản phẩm được xây dựng sử dụng **DummyJSON API** với đầy đủ tính năng CRUD và dark mode support:

- **API Integration**: Sử dụng DummyJSON Products API
- **CRUD Operations**: Create, Read, Update, Delete products
- **Advanced Filtering**: Search, category filter, sorting
- **Pagination**: Server-side pagination
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Mobile-friendly interface

## API Endpoints sử dụng

### 1. Get All Products

```
GET https://dummyjson.com/products
```

**Parameters:**

- `limit`: Số sản phẩm mỗi trang (default: 10)
- `skip`: Số sản phẩm bỏ qua (pagination)
- `q`: Search query

**Response:**

```json
{
    "products": [
        {
            "id": 1,
            "title": "iPhone 9",
            "description": "An apple mobile which is nothing like apple",
            "price": 549,
            "discountPercentage": 12.96,
            "rating": 4.69,
            "stock": 94,
            "brand": "Apple",
            "category": "smartphones",
            "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
            "images": ["https://i.dummyjson.com/data/products/1/1.jpg"]
        }
    ],
    "total": 100,
    "skip": 0,
    "limit": 10
}
```

### 2. Get Product Categories

```
GET https://dummyjson.com/products/categories
```

**Response:**

```json
[
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting"
]
```

### 3. Search Products

```
GET https://dummyjson.com/products/search?q=phone
```

### 4. Get Single Product

```
GET https://dummyjson.com/products/1
```

## Tính năng chính

### 1. **Dashboard Statistics**

- **Total Products**: Tổng số sản phẩm
- **Categories**: Số lượng danh mục
- **Low Stock**: Sản phẩm sắp hết hàng (< 10)
- **Average Rating**: Điểm đánh giá trung bình

### 2. **Advanced Filtering**

- **Search**: Tìm kiếm theo title, brand, category
- **Category Filter**: Lọc theo danh mục (Select2 dropdown)
- **Sorting**: Sắp xếp theo name, price, rating, stock, brand (Select2 dropdown)
- **Pagination**: Phân trang với limit 10/20/50 (Select2 dropdown)

### 3. **Product Management**

- **View Details**: Xem chi tiết sản phẩm với hình ảnh
- **Add Product**: Thêm sản phẩm mới (Select2 category dropdown)
- **Edit Product**: Chỉnh sửa thông tin sản phẩm (Select2 category dropdown)
- **Delete Product**: Xóa sản phẩm

### 4. **Product Display**

- **Product Cards**: Hiển thị với thumbnail, title, brand
- **Status Indicators**: In Stock, Low Stock, Out of Stock
- **Rating Stars**: Hiển thị đánh giá bằng sao
- **Price Display**: Giá gốc và giảm giá

## Cấu trúc Files

```
app/views/products/list.html           # Product management view
app/controllers/product-controller.js   # Product controller
assets/data/menu-data.json             # Menu configuration
app/route-config.js                    # Route configuration
```

## Cách sử dụng

### 1. **Truy cập Product Management**

- Vào menu **Products** → **Product List**
- Hoặc truy cập trực tiếp: `/products/list`

### 2. **Xem danh sách sản phẩm**

- Sản phẩm được hiển thị dạng table
- Mỗi sản phẩm có: thumbnail, title, brand, category, price, stock, rating
- Click vào actions để view/edit/delete

### 3. **Tìm kiếm và lọc**

- **Search**: Nhập từ khóa vào ô search
- **Category**: Chọn danh mục từ dropdown
- **Sort**: Chọn tiêu chí sắp xếp
- **Limit**: Chọn số sản phẩm hiển thị

### 4. **Thêm sản phẩm mới**

- Click **Add Product** button
- Điền thông tin: title, description, price, stock, category, brand
- Click **Create** để lưu

### 5. **Chỉnh sửa sản phẩm**

- Click icon **Edit** (✏️) trên sản phẩm
- Chỉnh sửa thông tin
- Click **Update** để lưu

### 6. **Xem chi tiết sản phẩm**

- Click icon **View** (👁️) trên sản phẩm
- Xem đầy đủ thông tin: hình ảnh, mô tả, đánh giá, reviews

### 7. **Xóa sản phẩm**

- Click icon **Delete** (🗑️) trên sản phẩm
- Xác nhận xóa

## Controller Functions

### 1. **Data Loading**

```javascript
$scope.loadProducts(); // Load products from API
$scope.loadCategories(); // Load categories from API
$scope.calculateStats(); // Calculate dashboard statistics
```

### 2. **Filtering & Pagination**

```javascript
$scope.applyFilters(); // Apply search, category, sort filters
$scope.nextPage(); // Go to next page
$scope.previousPage(); // Go to previous page
```

### 3. **CRUD Operations**

```javascript
$scope.addProduct(); // Show add product modal
$scope.editProduct(); // Show edit product modal
$scope.viewProduct(); // Show product details
$scope.deleteProduct(); // Delete product
$scope.saveProduct(); // Save product (create/update)
```

### 4. **Helper Functions**

```javascript
$scope.getStatusClass(); // Get CSS class for stock status
$scope.getStatusText(); // Get text for stock status
$scope.animateCounter(); // Animate counter numbers
```

## Select2 Integration

Hệ thống sử dụng **Select2** để tạo các dropdown combobox nâng cao:

### 1. **Select2 Features**

- **Searchable Dropdowns**: Tìm kiếm trong dropdown
- **Custom Styling**: Dark mode support
- **Responsive Design**: Mobile-friendly
- **Keyboard Navigation**: Arrow keys support
- **Clear Selection**: Xóa lựa chọn (cho category filter)

### 2. **Select2 Components**

- **Category Filter**: Dropdown với search và clear
- **Sort Filter**: Dropdown sắp xếp
- **Limit Filter**: Dropdown chọn số items
- **Modal Category**: Dropdown trong form thêm/sửa

### 3. **Select2 Configuration**

```javascript
$("#categoryFilter").select2({
    placeholder: "Select Category",
    allowClear: true,
    width: "100%",
    theme: "classic",
});
```

### 4. **Dark Mode Styling**

- Custom CSS cho dark mode
- Consistent với Tailwind theme
- Focus states và hover effects
- Responsive breakpoints

## Dark Mode Support

Tất cả components đều hỗ trợ dark mode:

### 1. **Cards & Tables**

```html
<div
    class="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
></div>
```

### 2. **Text Colors**

```html
<h3 class="text-gray-700 dark:text-gray-200">
    <span class="text-gray-500 dark:text-gray-400"></span>
</h3>
```

### 3. **Form Elements**

```html
<input
    class="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
/>
```

### 4. **Status Badges**

```html
<span
    class="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
></span>
```

## Responsive Design

### 1. **Mobile Layout**

- Stack filters vertically
- Scrollable table
- Touch-friendly buttons

### 2. **Tablet Layout**

- Side-by-side filters
- Responsive table columns

### 3. **Desktop Layout**

- Full-width table
- All filters visible
- Hover effects

## Error Handling

### 1. **API Errors**

- Console logging for debugging
- Graceful fallbacks
- Loading states

### 2. **Validation**

- Required field validation
- Price/stock number validation
- Form submission handling

### 3. **User Feedback**

- Loading spinners
- Success/error messages
- Confirmation dialogs

## Performance Optimizations

### 1. **API Calls**

- Debounced search
- Efficient pagination
- Cached categories

### 2. **UI Performance**

- Virtual scrolling for large lists
- Lazy loading images
- Optimized animations

### 3. **Memory Management**

- Cleanup on route change
- Proper event handling
- Resource disposal

## Future Enhancements

1. **Advanced Features**

    - Bulk operations (select multiple products)
    - Export to CSV/Excel
    - Import products from file
    - Product variants (size, color)

2. **Analytics**

    - Product performance metrics
    - Sales tracking
    - Inventory alerts
    - Trend analysis

3. **Integration**

    - Real API endpoints
    - Image upload
    - Payment integration
    - Shipping calculation

4. **User Experience**
    - Drag & drop reordering
    - Keyboard shortcuts
    - Advanced search filters
    - Saved searches

## Troubleshooting

### 1. **Products không load**

- Kiểm tra network connection
- Kiểm tra console errors
- Verify API endpoints

### 2. **Search không hoạt động**

- Kiểm tra search query format
- Verify API response
- Check filter logic

### 3. **Modal không hiển thị**

- Kiểm tra modal state variables
- Verify CSS z-index
- Check JavaScript errors

### 4. **Dark mode issues**

- Kiểm tra Tailwind classes
- Verify dark mode toggle
- Check CSS specificity

## Browser Support

- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

## Dependencies

- AngularJS 1.x
- DummyJSON API
- Tailwind CSS 3.x
- Font Awesome 6.x
- Select2 4.x (Enhanced dropdowns)

# Post Management System - DummyJSON API

## Tổng quan

Hệ thống quản lý bài viết được xây dựng sử dụng **DummyJSON Posts API** với đầy đủ tính năng CRUD và dark mode support:

- **API Integration**: Sử dụng DummyJSON Posts API
- **CRUD Operations**: Create, Read, Update, Delete posts
- **Advanced Filtering**: Search, tag filter, sorting
- **Pagination**: Server-side pagination
- **Comments Integration**: Load comments cho từng post
- **Dark Mode**: Full dark mode support
- **Select2 Integration**: Enhanced dropdowns
- **Responsive Design**: Mobile-friendly interface

## API Endpoints sử dụng

### 1. Get All Posts

```
GET https://dummyjson.com/posts
```

**Parameters:**

- `limit`: Số bài viết mỗi trang (default: 10)
- `skip`: Số bài viết bỏ qua (pagination)
- `q`: Search query

**Response:**

```json
{
    "posts": [
        {
            "id": 1,
            "title": "His mother had always taught him",
            "body": "His mother had always taught him not to ever think of himself as better than others. He'd never had that problem though. There were plenty of others who were willing to do that for him.",
            "userId": 9,
            "tags": ["history", "american", "crime"],
            "reactions": {
                "likes": 2,
                "dislikes": 0
            },
            "views": 100
        }
    ],
    "total": 150,
    "skip": 0,
    "limit": 10
}
```

### 2. Get Single Post

```
GET https://dummyjson.com/posts/1
```

### 3. Search Posts

```
GET https://dummyjson.com/posts/search?q=history
```

### 4. Get Post Comments

```
GET https://dummyjson.com/posts/1/comments
```

**Response:**

```json
{
    "comments": [
        {
            "id": 1,
            "body": "This is some awesome thinking!",
            "postId": 1,
            "user": {
                "id": 2,
                "username": "hbingley1",
                "fullName": "Hollis Binger"
            },
            "likes": 2
        }
    ],
    "total": 1,
    "skip": 0,
    "limit": 1
}
```

### 5. Add New Post

```
POST https://dummyjson.com/posts/add
```

### 6. Update Post

```
PUT https://dummyjson.com/posts/1
```

### 7. Delete Post

```
DELETE https://dummyjson.com/posts/1
```

## Tính năng chính

### 1. **Dashboard Statistics**

- **Total Posts**: Tổng số bài viết
- **Total Views**: Tổng lượt xem
- **Total Likes**: Tổng lượt thích
- **Tags**: Số lượng tags duy nhất

### 2. **Advanced Filtering**

- **Search**: Tìm kiếm theo title, body, tags
- **Tag Filter**: Lọc theo tag (Select2 dropdown)
- **Sorting**: Sắp xếp theo title, likes, views, userId (Select2 dropdown)
- **Pagination**: Phân trang với limit 10/20/50 (Select2 dropdown)

### 3. **Post Management**

- **View Details**: Xem chi tiết bài viết với comments
- **Add Post**: Thêm bài viết mới (Select2 multiple tags)
- **Edit Post**: Chỉnh sửa bài viết (Select2 multiple tags)
- **Delete Post**: Xóa bài viết

### 4. **Post Display**

- **Post Cards**: Hiển thị với title, body preview, tags
- **Reactions**: Hiển thị likes/dislikes
- **Views**: Số lượt xem
- **Author**: User ID
- **Tags**: Badge tags với màu sắc

### 5. **Comments Integration**

- **Load Comments**: Tự động load comments khi xem chi tiết
- **Comment Display**: Hiển thị user info, likes, content
- **Scrollable**: Comments section có thể scroll

## Cấu trúc Files

```
app/views/posts/list.html           # Post management view
app/controllers/post-controller.js   # Post controller
assets/data/menu-data.json          # Menu configuration
app/route-config.js                 # Route configuration
```

## Cách sử dụng

### 1. **Truy cập Post Management**

- Vào menu **Posts** → **Post List**
- Hoặc truy cập trực tiếp: `/posts/list`

### 2. **Xem danh sách bài viết**

- Bài viết được hiển thị dạng table
- Mỗi bài viết có: title, body preview, tags, reactions, views, author
- Click vào actions để view/edit/delete

### 3. **Tìm kiếm và lọc**

- **Search**: Nhập từ khóa vào ô search
- **Tag**: Chọn tag từ dropdown
- **Sort**: Chọn tiêu chí sắp xếp
- **Limit**: Chọn số bài viết hiển thị

### 4. **Thêm bài viết mới**

- Click **Add Post** button
- Điền thông tin: title, body, userId, tags (multiple select)
- Click **Create** để lưu

### 5. **Chỉnh sửa bài viết**

- Click icon **Edit** (✏️) trên bài viết
- Chỉnh sửa thông tin
- Click **Update** để lưu

### 6. **Xem chi tiết bài viết**

- Click icon **View** (👁️) trên bài viết
- Xem đầy đủ thông tin: title, body, tags, reactions, views
- Xem comments của bài viết

### 7. **Xóa bài viết**

- Click icon **Delete** (🗑️) trên bài viết
- Xác nhận xóa

## Controller Functions

### 1. **Data Loading**

```javascript
$scope.loadPosts(); // Load posts from API
$scope.loadTags(); // Load tags from posts
$scope.calculateStats(); // Calculate dashboard statistics
```

### 2. **Filtering & Pagination**

```javascript
$scope.applyFilters(); // Apply search, tag, sort filters
$scope.nextPage(); // Go to next page
$scope.previousPage(); // Go to previous page
```

### 3. **CRUD Operations**

```javascript
$scope.addPost(); // Show add post modal
$scope.editPost(); // Show edit post modal
$scope.viewPost(); // Show post details with comments
$scope.deletePost(); // Delete post
$scope.savePost(); // Save post (create/update)
```

### 4. **Helper Functions**

```javascript
$scope.getReactionClass(); // Get CSS class for reaction type
$scope.animateCounter(); // Animate counter numbers
$scope.initSelect2(); // Initialize Select2 dropdowns
```

## Select2 Integration

Hệ thống sử dụng **Select2** cho các dropdown nâng cao:

### 1. **Select2 Components**

- **Tag Filter**: Dropdown với search và clear
- **Sort Filter**: Dropdown sắp xếp
- **Limit Filter**: Dropdown chọn số items
- **Modal Tags**: Multiple select cho tags trong form

### 2. **Select2 Configuration**

```javascript
// Tag filter
$("#tagFilter").select2({
    placeholder: "Select Tag",
    allowClear: true,
    width: "100%",
    theme: "classic",
});

// Multiple tags in modal
$("#modalTags").select2({
    placeholder: "Select Tags",
    allowClear: true,
    width: "100%",
    theme: "classic",
    multiple: true,
});
```

### 3. **Features**

- **Searchable**: Tìm kiếm trong dropdown
- **Multiple Select**: Chọn nhiều tags
- **Clear Selection**: Xóa lựa chọn
- **Keyboard Navigation**: Arrow keys support

## Dark Mode Support

Tất cả components đều hỗ trợ dark mode:

### 1. **Cards & Tables**

```html
<div
    class="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
></div>
```

### 2. **Text Colors**

```html
<h3 class="text-gray-700 dark:text-gray-200">
    <span class="text-gray-500 dark:text-gray-400"></span>
</h3>
```

### 3. **Form Elements**

```html
<input
    class="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
/>
```

### 4. **Tag Badges**

```html
<span
    class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
></span>
```

### 5. **Reaction Icons**

```html
<i class="text-green-600 dark:text-green-400">
    <i class="text-red-600 dark:text-red-400"></i
></i>
```

## Responsive Design

### 1. **Mobile Layout**

- Stack filters vertically
- Scrollable table
- Touch-friendly buttons
- Responsive modals

### 2. **Tablet Layout**

- Side-by-side filters
- Responsive table columns
- Optimized modal width

### 3. **Desktop Layout**

- Full-width table
- All filters visible
- Hover effects
- Large modal windows

## Comments Integration

### 1. **Auto-load Comments**

- Comments được load khi xem chi tiết post
- API call: `GET /posts/{id}/comments`

### 2. **Comment Display**

- User information (name, username)
- Comment content
- Like count
- Scrollable container

### 3. **Error Handling**

- Graceful fallback nếu không load được comments
- Loading state
- Empty state

## Error Handling

### 1. **API Errors**

- Console logging for debugging
- Graceful fallbacks
- Loading states
- User-friendly error messages

### 2. **Validation**

- Required field validation
- User ID number validation
- Tags array validation
- Form submission handling

### 3. **User Feedback**

- Loading spinners
- Success/error messages
- Confirmation dialogs
- Progress indicators

## Performance Optimizations

### 1. **API Calls**

- Debounced search
- Efficient pagination
- Cached tags
- Optimized comment loading

### 2. **UI Performance**

- Virtual scrolling for large lists
- Lazy loading comments
- Optimized animations
- Efficient DOM updates

### 3. **Memory Management**

- Cleanup on route change
- Proper event handling
- Resource disposal
- Select2 cleanup

## Future Enhancements

1. **Advanced Features**

    - Rich text editor cho content
    - Image upload cho posts
    - Post categories
    - Post scheduling
    - Draft posts

2. **Analytics**

    - Post performance metrics
    - View tracking
    - Engagement analytics
    - Popular posts

3. **Integration**

    - Real API endpoints
    - User authentication
    - Social sharing
    - Email notifications

4. **User Experience**
    - Inline editing
    - Keyboard shortcuts
    - Advanced search filters
    - Saved searches
    - Post templates

## Troubleshooting

### 1. **Posts không load**

- Kiểm tra network connection
- Kiểm tra console errors
- Verify API endpoints

### 2. **Search không hoạt động**

- Kiểm tra search query format
- Verify API response
- Check filter logic

### 3. **Comments không hiển thị**

- Kiểm tra post ID
- Verify comments API
- Check network requests

### 4. **Select2 issues**

- Kiểm tra Select2 initialization
- Verify CSS loading
- Check JavaScript errors

### 5. **Dark mode issues**

- Kiểm tra Tailwind classes
- Verify dark mode toggle
- Check CSS specificity

## Browser Support

- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

## Dependencies

- AngularJS 1.x
- DummyJSON API
- Tailwind CSS 3.x
- Font Awesome 6.x
- Select2 4.x (Enhanced dropdowns)

## API Response Examples

### Post Object

```json
{
    "id": 1,
    "title": "His mother had always taught him",
    "body": "His mother had always taught him not to ever think of himself as better than others...",
    "userId": 9,
    "tags": ["history", "american", "crime"],
    "reactions": {
        "likes": 2,
        "dislikes": 0
    },
    "views": 100
}
```

### Comment Object

```json
{
    "id": 1,
    "body": "This is some awesome thinking!",
    "postId": 1,
    "user": {
        "id": 2,
        "username": "hbingley1",
        "fullName": "Hollis Binger"
    },
    "likes": 2
}
```

Hệ thống Post Management đã sẵn sàng sử dụng với đầy đủ tính năng CRUD, comments integration, và dark mode support! 🎉
