# DỰ ÁN DASHBOARD - QUY CHUẨN LẬP TRÌNH & ZERO-BUG POLICY

## 0. NGUYÊN TẮC CỐT LÕI (CORE META-RULES)

- **TUÂN THỦ 100% RULES:** Agent phải luôn luôn tuân thủ nghiêm ngặt 100% toàn bộ quy chuẩn đã đề ra trong tài liệu này và coding guidelines, tuyệt đối không được tự ý phá vỡ hay bỏ qua bất kỳ quy tắc nào.
- **KHÔNG TỰ SUY ĐOÁN — HỎI XÁC NHẬN TRƯỚC KHI THỰC HIỆN:** Khi gặp bất kỳ yêu cầu, logic, thiết kế hay tình huống kỹ thuật nào chưa được đề cập rõ ràng, Agent **BẮT BUỘC PHẢI DỪNG LẠI, HỎI XÁC NHẬN VỚI NGƯỜI DÙNG ĐỂ NGƯỜI DÙNG QUYẾT ĐỊNH** trước khi tiến hành code. Tuyệt đối không tự ý suy đoán và tự động làm theo ý mình.

## 1. TIÊU CHÍ ZERO-BUG & NGHIỆM THU

- **Quy tắc chạy lệnh kiểm tra:**
    - **TUYỆT ĐỐI KHÔNG TỰ Ý CHẠY `npx tsc --noEmit`** khi người dùng chưa yêu cầu hoặc sau các chỉnh sửa nhỏ. Chỉ chạy khi người dùng yêu cầu kiểm tra hoặc ở bước nghiệm thu cuối cùng được chỉ định.
    - Bộ 3 lệnh nghiệm thu khi được yêu cầu:
        1. `npx tsc --noEmit` -> 0 error (Type Safety tuyệt đối).
        2. `npm run lint` -> 0 error (SonarQube & TypeScript strict).
        3. `npm run build` -> Build Turbopack production thành công 100%.
- Không dùng `any`, không dùng `Math.random()` không an toàn, không dùng nested template literals.

## 2. CẤU TRÚC PHÂN TẦNG & TỔ CHỨC

- `src/views/<module>/...`: Giao diện chia theo phân hệ.
- `src/app/...`: App Router Next.js (routing & page wrapper).
- `src/types/<module>.ts`: Tách riêng interface, kế thừa từ `src/types/common.ts` (`BaseEntity`, `ApiResponse<T>`, `PaginationParams`...).
- `src/services/<module>.ts`: Tách riêng logic service và gọi API client.

## 3. KIẾN TRÚC RESTFUL API GATEWAY & KHO PUBLIC APIS MỞ

- Route Gateway tại `src/app/api/v1/...` tích hợp public APIs (VietQR, tỷ giá ngoại tệ, xăng dầu, giá vàng, DummyJSON...) kèm cơ chế mock fallback an toàn.
- Chuẩn hóa đầu ra `ApiResponse<T>`, sẵn sàng ráp Backend thật mà không sửa UI.
- **DANH MỤC KHAI THÁC THEO PHÂN HỆ:**
    1. **Tài chính & Ngân sách (`reports/finance`, `accounting`):**
        - `VietQR Gateway`: Lấy danh sách 65+ ngân hàng Việt Nam, sinh mã QR thanh toán mẫu.
        - `Vietcombank / Frankfurter`: Tỷ giá ngoại tệ hối đoái trực tiếp.
        - `SJC Gold & Petrolimex`: Bảng giá vàng và giá xăng dầu cập nhật.
    2. **Bán hàng & CRM (`sales`, `crm`):**
        - `Provinces Open API`: 63 tỉnh/thành, quận/huyện, phường/xã Việt Nam.
        - `IP Geolocation`: Định vị thành phố, quốc gia khách hàng.
    3. **Vận hành & Kho vận (`operations`, `inventory`):**
        - `Open-Meteo & 7Timer!`: Dự báo thời tiết, nhiệt độ, cảnh báo mưa bão cho lộ trình giao hàng.
        - `OpenRouteService`: Tính lộ trình và khoảng cách kho vận.
    4. **IT, Hệ thống & Bảo mật (`it`, `system`):**
        - `HaveIBeenPwned`: Kiểm tra rò rỉ thông tin đăng nhập/mật khẩu nhân viên.
        - `VirusTotal / PhishTank`: Quét tệp tin và liên kết độc hại.
        - `IP-API`: Truy vết IP đăng nhập bất thường trong Audit Logs.
    5. **Nhân sự (`hr`):**
        - `Nager.Date / Holidays API`: Lịch ngày nghỉ lễ quốc gia Việt Nam (tính công chuẩn).
    6. **Marketing & Nội dung (`marketing`, `content`):**
        - `Rút gọn liên kết`: Rút gọn đường dẫn chiến dịch tiếp thị.
        - `Unsplash / Pixabay`: Thư viện ảnh stock cho bài viết và banner.
    7. **Tiện ích chung (`apps`, `workflow`):**
        - `goQR.me`: Trình sinh mã QR đa năng cho tài liệu, văn bản nội bộ.
        - `DummyJSON`: Dữ liệu mẫu phong phú thay thế các màn "Coming soon...".
- **QUY TẮC AN TOÀN TIỀN TỆ (BẮT BUỘC):**
    - Mọi chức năng liên quan đến tài chính, ngân hàng, hóa đơn, mã QR chuyển khoản **100% LÀ DEMO THỬ NGHIỆM**.
    - Tuyệt đối cấm giao dịch chuyển tiền thật.
    - Về mặt UI/UX, giữ giao diện sạch đẹp, chuyên nghiệp, KHÔNG gắn watermark hay nhãn cảnh báo đỏ "DEMO ONLY" to đùng làm hỏng trải nghiệm người dùng (giữ trong lòng thôi, không show trên web).

## 4. TƯƠNG TÁC GIAO DIỆN & DESIGN SYSTEM

- **BẮT BUỘC 100% HEROUI V3 — TUYỆT ĐỐI KHÔNG TỰ CHẾ:**
    - **BẮT BUỘC 100% IMPORT QUA `@/components/common`:** Mọi component giao diện (Card, Button, Tabs, Table, Chip, Avatar, ProgressBar, Badge, Modal, Input, Select, SelectItem, Tooltip...) **BẮT BUỘC PHẢI IMPORT TỪ `@/components/common`**. TUYỆT ĐỐI CẤM import trực tiếp từ `@heroui/react` hoặc `@heroui/compat` trong các file view/page/widget. Nếu component chưa có trong common, phải tạo file bọc chuẩn trong `src/components/common/` và export qua `index.ts`.
    - Khi HeroUI đã cung cấp sẵn component (như `Card`, `Button`, `Tabs`, `Table`, `Chip`, `Avatar`, `ProgressBar`, `Badge`, `Modal`, `Input`, `Select`, `Tooltip`, `Pagination`...), **TUYỆT ĐỐI CẤM** dùng thẻ HTML thuần (`<button>`, `<table>`, `<div>` giả card, thanh `<div>` tự vẽ % tiến độ...) hoặc tự viết CSS/logic chắp vá.
    - Tuân thủ cấu trúc Compound Components của HeroUI v3 (`Table.Header`, `Table.Column`, `Table.Body`, `Table.Row`, `Table.Cell`, `Card.Content`, `ProgressBar.Track`, `Avatar.Image`, `Avatar.Fallback`...).
    - Chuẩn hoá props theo v3: `Chip` dùng `variant="soft"` (không dùng `variant="flat"` hay `solid` kiểu cũ), `color` dùng `accent`, `success`, `warning`, `danger`.
    - **TUYỆT ĐỐI KHÔNG THÊM CLASS VÀO HEROUI COMPONENT KHI KHÔNG ĐƯỢC CHỈ ĐỊNH:** Không tự tiện truyền class Tailwind (`rounded-...`, `bg-...`, `shadow-...`, `text-...`, `p-...`) vào component của HeroUI (`Button`, `Chip`, `Card`, `Table`, `Tabs`, `Input`, `Select`, `ProgressBar`...). Luôn dùng các props chính thức (`variant`, `color`, `size`...). Chỉ thêm class khi người dùng chỉ định rõ ràng.
- Không để Modal tĩnh (phải có state, validation, footer nút Lưu/Hủy).
- Không để Action rỗng (Duyệt/Từ chối/Xóa phải cập nhật dữ liệu và refresh).
- Icon bắt buộc dạng SVG (@heroicons/react, @iconify/react), TUYỆT ĐỐI KHÔNG dùng emoji.
- Bắt buộc áp dụng `font-variant-numeric: tabular-nums` cho toàn bộ số liệu và ngày tháng.
- **QUY CHUẨN CĂN LỀ DỮ LIỆU BẢNG (TABLE):**
    - **Số liệu / Tiền tệ / Phần trăm / Số lượng:** Bắt buộc canh phải (`text-right`).
    - **Ngày tháng / Thời gian / Hạn chót:** Bắt buộc canh giữa (`text-center`).
    - **Text / Tên / Mô tả / Thông tin định danh:** Bắt buộc canh trái (`text-left`).
    - Cả tiêu đề cột (`Table.Column`) và nội dung ô (`Table.Cell`) phải đồng bộ căn lề giống nhau.
    - Tiêu đề cột `thead` dùng chữ thường (Sentence case / Title case nhẹ), KHÔNG viết hoa toàn bộ.
- **QUY CHUẨN ĐƠN VỊ & CLASS TAILWIND CSS (BẮT BUỘC):**
    - **Thứ tự ưu tiên:** Class có sẵn của Tailwind > Class truyền `rem` vào ngoặc vuông `[...]`.
    - **TUYỆT ĐỐI CẤM DÙNG ĐƠN VỊ `px`** trong code styling (ví dụ: KHÔNG dùng `border-b-[3px]`, `w-[320px]`, `p-[10px]`, `text-[13px]`).
    - Khi bắt buộc dùng arbitrary values `[...]`, phải quy đổi sang `rem` (ví dụ: `3px` = `[0.1875rem]`, `10px` = `[0.625rem]`, `14px` = `[0.875rem]`).
- **ƯU TIÊN TONE MÀU PASTEL (KHÔNG DÙNG MÀU QUÁ ĐẬM/GẮT):**
    - Mọi thành phần giao diện (viền thẻ, nền phụ, biểu đồ, thanh tiến độ, badge/chip...) ưu tiên sử dụng gam màu Pastel thanh lịch, dịu nhẹ, độ bão hòa vừa phải.
    - Tuyệt đối tránh sử dụng các mảng màu quá đậm đặc, chói gắt hoặc tương phản quá mạnh gây mỏi mắt.
    - Đồng bộ hài hòa và êm dịu trên cả Light mode và Dark mode.
- **TẬN DỤNG TONE MÀU DANGER & DANGER-SOFT ĐÚNG NGỮ CẢNH (BẮT BUỘC):**
    - **Hành động Đóng / Hủy bỏ / Thoát không lưu:** Cho phép sử dụng `Button variant="danger-soft"` (tone đỏ pastel nhạt dịu mắt chuẩn HeroUI v3) để biểu thị rõ hành vi hủy bỏ/thoát modal mà không gây chói gắt. Khi nút "Đóng" dùng `danger-soft`, nút *"Xóa bộ lọc"* (Clear) chuyển sang `variant="outline"` hoặc `variant="ghost"` để cân bằng trực quan.
    - **Hành động Xóa / Từ chối:** Nút Xóa bản ghi (Delete), Từ chối duyệt (Reject) bắt buộc dùng `Button variant="danger"`.
    - **Trạng thái Tiêu cực / Nguy cấp:** Quá hạn (`overdue`), Hủy (`cancelled`), Thất bại (`failed`), Vượt ngân sách (`over_budget`), Rủi ro cao (`high_risk`) bắt buộc dùng `Chip color="danger" variant="soft"`.
    - **Cảnh báo lỗi:** Lỗi hệ thống, API fail bắt buộc dùng `Alert status="danger"`.
- **QUY CHUẨN THÔNG BÁO NGHIỆP VỤ & TOAST ĐỒNG NHẤT (CRUD & DATA FETCHING) (BẮT BUỘC):**
    - **100% sử dụng bộ helper chuẩn hóa từ `@/components/common`:** Bắt buộc dùng `notifyFetchSuccess`, `notifyCreateSuccess`, `notifyUpdateSuccess`, `notifyDeleteSuccess` (hoặc object `notify.*`, hoặc hook `useTableData({ entityName })`).
    - **TUYỆT ĐỐI KHÔNG TỰ BỊA CÂU CHỮ HOẶC DÙNG THẺ TEXT TĨNH:** Tuyệt đối cấm mỗi màn hình tự viết câu chữ Toast tùy tiện (màn thì "Đã tải...", màn thì "Thành công...") hoặc cắm các thẻ `<div>` chữ tĩnh trên Filter Bar. Toàn bộ thông báo CRUD phải tuân theo format chuẩn:
        - Tải dữ liệu: `notifyFetchSuccess(entityName, count)` -> `"Dữ liệu {entityName}"` / `"Đã tải {count} {entityName}"`.
        - Thêm mới: `notifyCreateSuccess(entityName, detail)` -> `"Thêm mới {entityName} thành công"`.
        - Cập nhật: `notifyUpdateSuccess(entityName, detail)` -> `"Cập nhật {entityName} thành công"`.
        - Xóa: `notifyDeleteSuccess(entityName, detail)` -> `"Xóa {entityName} thành công"`.
        - Thất bại: `notifyFetchError`, `notifyCreateError`, `notifyUpdateError`, `notifyDeleteError`.
    - **Vị trí hiển thị:** Cố định chuẩn `Toast.Provider placement="top end"` (góc trên bên phải) tại Root Provider.


## 5. QUY TRÌNH BẮT BUỘC KHI VIẾT GIAO DIỆN (HEROUI FIRST & MCP LOOKUP)

- **BƯỚC 1: TRA CỨU MCP TRƯỚC KHI CODE (MANDATORY LOOKUP):**
    - Trước khi dựng bất kỳ giao diện, màn hình, form, hay widget nào, Agent **BẮT BUỘC** phải gọi MCP tool `heroui-react` (`list_components`, `get_component_docs`, `get_component_source_code`) hoặc tra cứu thư mục `./.heroui-docs/react/` để kiểm tra HeroUI đã có component tương ứng hay chưa.
- **BƯỚC 2: ƯU TIÊN TUYỆT ĐỐI COMPONENT CÓ SẴN — KHÔNG TỰ CUSTOM:**
    - 100% ưu tiên sử dụng component nguyên bản của HeroUI v3 (Compound Components: Card, Button, Modal, Table, Tabs, Select, Input, Popover, Tooltip, Chip, Avatar, Slider, ProgressBar...).
    - **TUYỆT ĐỐI KHÔNG TỰ CHẾ / KHÔNG CUSTOM** các thẻ HTML thuần hoặc tự dựng logic/CSS riêng khi HeroUI đã có giải pháp chính thức.
    - Tham khảo trực tiếp code mẫu và props chuẩn tại `./.heroui-docs/react/demos/`.

## 6. QUY CHUẨN THIẾT KẾ MÀN HÌNH ĐỒNG BỘ (STANDARD PAGE LAYOUT & ZERO-DRIFT UI)

Mọi màn hình danh sách (Listing Screens / Table Views) trên toàn bộ hệ thống bắt buộc phải tuân thủ đồng bộ cấu trúc 5 tầng giao diện sau:

1. **TẦNG 1: TOP BAR ĐIỀU HƯỚNG & HÀNH ĐỘNG GỌN GÀNG (TOP BAR & QUICK ACTIONS):**
    - **Bên trái:** `Breadcrumb` định vị phân hệ và màn hình hiện tại.
    - **Bên phải:** Cụm nút hành động chính (`Button` kích thước `sm`): nút _"Làm mới dữ liệu"_ (`variant="secondary"`) và nút _"Tạo mới / Thêm mới"_ (`variant="primary"`).
    - **TUYỆT ĐỐI KHÔNG DÙNG HEADER CỒNG KỀNH:** Không tạo các khối tiêu đề `h1` to đùng kèm đoạn văn bản mô tả dài dòng làm đẩy nội dung chính xuống dưới, gây mất diện tích màn hình.

2. **TẦNG 2: THẺ THỐNG KÊ KPI NHANH (QUICK STATS CARDS):**
    - Dàn trang chuẩn: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4`.
    - **Bắt buộc sử dụng component dùng chung `StatCard` từ `@/components/common` tuân thủ nghiêm ngặt thứ tự màu hiển thị (Color Hierarchy)**:
        - Thẻ 1: `variant="primary"` (Xanh dương / Blue - Chỉ số chính, tổng bản ghi).
        - Thẻ 2: `variant="secondary"` (Tím / Purple / Indigo - Chỉ số phụ, đang tiến hành/hoạt động).
        - Thẻ 3: `variant="tertiary"` hoặc `thirdary` (Xanh ngọc / Emerald - Chỉ số cấp ba, hoàn thành/tích cực).
        - Thẻ 4: `variant="quaternary"` hoặc `fourth` (Vàng hổ phách / Amber - Chỉ số cấp bốn, ngân sách/cảnh báo/chờ duyệt).
    - Tự động áp dụng `font-variant-numeric: tabular-nums` và hỗ trợ `isLoading`.

3. **TẦNG 3: BỘ LỌC & TÌM KIẾM DỮ LIỆU (FILTER & SEARCH BAR):**
    - Đặt gọn trong `Card className="p-4"`.
    - **Quy tắc tương phản trên Card/Surface (Bắt buộc):** Khi đặt trong container nền `primary` (như `Card`, `Surface`), mọi control con (`SearchField`, `Select`, `Input`...) **bắt buộc dùng `variant="secondary"`** để hiển thị nền phân tách (`var(--default)`), đảm bảo độ tương phản sắc nét và tuyệt đối không bị chìm vào nền thẻ.
    - **Bên trái:** `SearchField variant="secondary"` chuẩn HeroUI v3 Compound Component (`SearchField.Group`, `SearchField.SearchIcon`, `SearchField.Input`, `SearchField.ClearButton`) — Tuyệt đối không dùng Input thường chắp vá icon thủ công.
    - **Bên phải:** Các `Select variant="secondary"` lọc theo trạng thái, phân loại, nhân sự phụ trách (100% nạp từ API động), nút _"Đặt lại bộ lọc"_ (khi có filter kích hoạt) và bộ đếm kết quả tìm kiếm `tabular-nums`.

4. **TẦNG 4: BẢNG DỮ LIỆU & STICKY HEADER CHỐNG TRÔI (TABLE & SCROLL CONTAINER):**
    - Đặt trong `Card className="overflow-hidden p-0"`.
    - Sử dụng Compound `Table` chuẩn HeroUI v3 nguyên bản từ `@/components/common`.
    - **Khống chế chiều cao & Scroll:** `Table.ScrollContainer` bắt buộc có `max-h-112 overflow-y-auto` (không để bảng dài lê thê làm mất tầm nhìn toàn trang).
    - **Sắp xếp cột (Sorting):** Sử dụng prop `allowsSorting` trên `Table.Column`, bọc tiêu đề cột trong `<Table.SortableColumnHeader sortDirection={sortDirection}>`. **Icon sắp xếp (chevron/indicator) đã được HeroUI tích hợp sẵn 100%, tuyệt đối không tự thêm icon mũi tên thủ công.**
    - **Căn lề dữ liệu:** Số/tiền/tiến độ canh phải (`text-right`), Ngày tháng/trạng thái canh giữa (`text-center`), Text/tên/mã canh trái (`text-left`). Tiêu đề cột `thead` dùng chữ thường (Sentence case / Title case nhẹ), KHÔNG viết hoa toàn bộ.
    - **Trạng thái trống (Empty State):** Bắt buộc dùng prop `renderEmptyState={() => <Table.EmptyState ... />}` từ `@/components/common`. **Tuyệt đối cấm render hàng `Table.Row` giả mạo kèm `colSpan`** để tránh xung đột với React Aria.

5. **TẦNG 5: THANH ĐIỀU KHIỂN PHÂN TRANG CHUẨN (STANDARD PAGINATION IN TABLE.FOOTER):**
    - **Bắt buộc sử dụng component dùng chung `Table.PaginationFooter` từ `@/components/common`** đặt trong thẻ `Table`:
        - Tự động gói chuẩn 3 khối: Chọn số bản ghi / trang (`Select size="sm"` bên trái), Thống kê số lượng (`Pagination.Summary` dạng `tabular-nums` ở giữa), và Bộ điều khiển chuyển trang HeroUI Compound (`Pagination.Content` kèm logic ellipsis bên phải).
        - Không tự viết lại hàm phân trang `renderPaginationItems` hay khối Footer thủ công.
    - **Cơ chế On/Off phân trang:** Mặc định luôn luôn là **Bật (default ON)**. Khi tắt, bảng hiển thị toàn bộ bản ghi và ẩn `Table.PaginationFooter`.
