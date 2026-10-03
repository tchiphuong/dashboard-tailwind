# QUY CHUẨN LẬP TRÌNH (CODING GUIDELINES & ZERO-BUG POLICY)

Tài liệu này tổng hợp toàn bộ các quy tắc và tiêu chuẩn lập trình bắt buộc áp dụng cho toàn bộ dự án, được thiết lập dựa trên chỉ đạo trực tiếp của Senior/Lead Developer:

1. **Tuân thủ tuyệt đối 100% Rules:** Bất kỳ AI Agent hay Developer nào làm việc trên repository này đều phải tuân thủ nghiêm ngặt 100%, không có ngoại lệ.
2. **Hỏi xác nhận khi chưa được đề cập:** Với bất kỳ vấn đề, yêu cầu, hành vi hay quyết định kiến trúc/giao diện nào chưa được đề cập rõ ràng, **BẮT BUỘC PHẢI DỪNG LẠI HỎI XÁC NHẬN VỚI NGƯỜI DÙNG ĐỂ HỌ QUYẾT ĐỊNH TRƯỚC KHI THỰC HIỆN**, nghiêm cấm việc tự ý phỏng đoán và tự động làm theo ý mình.

---

## 1. TIÊU CHÍ ZERO-BUG & NGHIỆM THU BẮT BUỘC (MANDATORY VERIFICATION)

Tuyệt đối không chấp nhận bug dù chỉ là 1. **Lưu ý quan trọng:** **TUYỆT ĐỐI KHÔNG TỰ Ý CHẠY `npx tsc --noEmit`** sau mỗi chỉnh sửa nhỏ khi người dùng chưa yêu cầu. Chỉ chạy kiểm tra khi người dùng yêu cầu hoặc ở bước nghiệm thu cuối cùng được chỉ định:

1. **Kiểm tra Type Safety**:
   ```bash
   npx tsc --noEmit
   ```
   - **Yêu cầu**: Đạt **0 error** (Exit Code 0).
   - Nghiêm cấm dùng `any` bừa bãi. Mọi dữ liệu phải có type/interface rõ ràng.

2. **Kiểm tra Quy tắc SonarQube & ESLint**:
   ```bash
   npm run lint
   ```
   - **Yêu cầu**: Đạt **0 error** (Exit Code 0).
   - Tuân thủ nghiêm ngặt các quy tắc SonarQube:
     - Không dùng nested template literals (`sonarjs/no-nested-template-literals`).
     - Không dùng `Math.random()` cho định danh hoặc logic cần ổn định (`sonarjs/pseudo-random`).
     - Không để comment `TODO` bừa bãi chưa giải quyết (`sonarjs/todo-tag`).
     - Tối ưu cognitive complexity (`sonarjs/cognitive-complexity`).
     - Khai báo đầy đủ dependencies cho các React Hooks (`react-hooks/exhaustive-deps`).

3. **Kiểm tra Biên dịch Production (Production Build)**:
   ```bash
   npm run build
   ```
   - **Yêu cầu**: Build Turbopack thành công 100% không vấp lỗi compile hoặc route generation.

---

## 2. QUY CHUẨN KIẾN TRÚC & CẤU TRÚC THƯ MỤC (PROJECT STRUCTURE)

Dự án áp dụng mô hình phân tách tầng rõ rệt:

```
src/
├── app/                  # Next.js App Router (Chỉ làm routing và page wrapper mỏng)
│   ├── (admin)/...       # Các routes quản trị hệ thống
│   └── api/v1/...        # Tầng RESTful API Gateway trung gian
├── views/                # Toàn bộ mã nguồn giao diện chia theo module/phân hệ
│   ├── auth/             # Xác thực (Đăng nhập, đăng ký...)
│   ├── dashboard/        # Bảng điều khiển, báo cáo
│   ├── hr/               # Phân hệ Quản lý Nhân sự
│   ├── inventory/        # Phân hệ Kho & Mua hàng
│   ├── system/           # Cấu hình hệ thống, người dùng, phân quyền
│   └── ...
├── services/             # Logic nghiệp vụ và gọi API (Service Layer)
├── types/                # Định nghĩa Types và Interfaces dùng chung
├── lib/                  # Utilities, API client chuẩn, toast queue
├── contexts/             # Global React Contexts (AuthContext...)
└── components/           # UI Components tái sử dụng (Common Table, Modal, PageHeader...)
```

---

## 3. TÁCH BIỆT INTERFACE & SERVICE, KẾ THỪA COMMON INTERFACE

### A. Tách riêng Interface và Service
- **Nghiêm cấm** định nghĩa interface trực tiếp lẫn lộn bên trong file service hay component nếu dùng chung.
- Đặt toàn bộ interface tại `src/types/` hoặc `src/types/<module>.ts`.
- Đặt service tại `src/services/<module>.service.ts` hoặc `src/services/<module>.ts`.

### B. Kế thừa Common Interfaces
Mọi entity đều phải kế thừa từ các định dạng chuẩn trong `src/types/common.ts`:
- `BaseEntity`: Chứa `id`, `createdAt`, `updatedAt`, `status`.
- `PaginationParams`: `page`, `pageSize`, `search`, `sortBy`, `sortDirection`.
- `PaginationResponse<T>` & `ApiResponse<T>`: Chuẩn hóa mọi phản hồi từ API.
- `TableColumn<T>` & `TableAction<T>`: Chuẩn hóa cột bảng và hành động.

---

## 4. KIẾN TRÚC RESTFUL API GATEWAY & TÍCH HỢP PUBLIC API

- **Cơ chế Gateway (`src/app/api/v1/...`)**:
  - Giao diện Frontend gọi tới `/api/v1/...`.
  - Tầng API Gateway xử lý proxy, gọi các public APIs miễn phí chất lượng (như hệ sinh thái `apis.j2team.org`, VietQR, DummyJSON, Open-Meteo, ExchangeRate...) để mô phỏng dữ liệu thật 100%.
  - Luôn trang bị cơ chế **Mock Fallback an toàn** (`mock-api-fallback.ts`) khi API bên ngoài bị nghẽn mạng hoặc hết hạn mức.
- **Sẵn sàng cho Backend thật (Drop-in BE Replacement)**:
  - Chuẩn hóa định dạng trả về là `ApiResponse<T>`.
  - Khi Backend hoàn thiện, chỉ cần đổi cấu hình Base URL hoặc endpoint trong Gateway mà không cần đụng chạm hay viết lại mã nguồn giao diện Frontend.

---

## 5. QUY CHUẨN TƯƠNG TÁC GIAO DIỆN (UI/UX INTERACTIVITY)

Tuyệt đối không để lại giao diện "chết" (UI tĩnh không bấm được):
1. **Modal Form**:
   - Mọi modal thêm mới/chỉnh sửa phải có state quản lý dữ liệu nhập (two-way binding).
   - Bắt buộc có `footer` chứa nút **Hủy** và nút **Lưu / Gửi**.
   - Khi bấm gửi phải thực thi cập nhật state hoặc gọi API, đóng modal và kích hoạt `refresh()` lại danh sách.
2. **Action Trong Bảng (Table Actions)**:
   - Các nút Duyệt, Từ chối, Xóa, Sửa phải có handler xử lý dữ liệu thật, không được để hàm rỗng.
   - Sau khi thao tác phải có thông báo toast phản hồi cho người dùng.
3. **Bảng Dữ Liệu (`Table`)**:
   - Luôn hỗ trợ: Phân trang (Pagination), Tìm kiếm (Search), Làm mới (Refresh), và Trạng thái tải (Loading Skeleton).

---

## 6. QUY CHUẨN THẨM MỸ & THƯ VIỆN GIAO DIỆN (DESIGN SYSTEM)

1. **Quy trình dựng giao diện (HeroUI v3 First & MCP Lookup):**
   - **Bắt buộc 100% import UI Component qua `@/components/common`:** Tuyệt đối cấm import trực tiếp từ `@heroui/react` hay `@heroui/compat` tại các file views, pages hay components chức năng. Mọi component phải được gọi thông qua `@/components/common`. Nếu component chưa có trong common, phải tạo file bọc chuẩn trong `src/components/common/` và export qua `index.ts`.
   - **Bắt buộc tra cứu MCP trước khi code:** Khi chuẩn bị dựng bất kỳ màn hình hoặc component nào, phải dùng MCP tool `heroui-react` (`list_components`, `get_component_docs`, `get_component_source_code`) hoặc kiểm tra `./.heroui-docs/react/` để rà soát component có sẵn.
   - **Không tự custom:** Ưu tiên tuyệt đối các component có sẵn của HeroUI v3 (Compound Components). Nghiêm cấm tự tạo component HTML hoặc viết CSS thủ công thay thế cho các component thư viện đã hỗ trợ.
   - **KHÔNG ĐƯỢC THÊM CLASS VÀO HEROUI COMPONENT KHI KHÔNG ĐƯỢC CHỈ ĐỊNH (BẮT BUỘC):**
     - HeroUI v3 đã tích hợp sẵn hệ thống Design Tokens và styling hoàn chỉnh.
     - **TUYỆT ĐỐI CẤM** tự tiện nhồi các class Tailwind (như `rounded-...`, `bg-...`, `text-...`, `shadow-...`, `border-...`, `p-...`) vào các component của HeroUI (`Button`, `Chip`, `Card`, `Table`, `Tabs`, `Input`, `Select`, `ProgressBar`...) để ghi đè giao diện thư viện.
     - Luôn luôn tận dụng các props chuẩn: `variant`, `color`, `size`, `isIconOnly`...
     - Chỉ được thêm class vào HeroUI component khi có yêu cầu chỉ định rõ ràng từ người dùng (ví dụ: styling viền đáy đặc biệt của Card theo yêu cầu).
2. **Icon**: Bắt buộc sử dụng icon dạng **SVG** (`@heroicons/react` hoặc `@iconify/react`).
   - **TUYỆT ĐỐI KHÔNG SỬ DỤNG EMOJI** làm icon trên giao diện người dùng.
3. **Tailwind CSS**: Sử dụng cú pháp chuẩn Tailwind CSS v4 (ví dụ: `bg-linear-to-r` thay thế cho `bg-gradient-to-r`).
4. **Màu sắc Pastel & Trải nghiệm (Bắt buộc)**:
   - **Ưu tiên tone màu Pastel:** Giữ tone màu hiện đại, ưu tiên tuyệt đối bảng màu Pastel (dịu nhẹ, thanh lịch, độ bão hòa thấp đến vừa phải) cho mọi thành phần hiển thị (viền, nền phụ, biểu đồ, thanh tiến độ, badge/chip...).
   - **Không dùng màu quá đậm:** Tránh hoàn toàn việc sử dụng màu quá đậm đặc, quá chói hay quá gắt gây cảm giác ngột ngạt và mỏi mắt khi nhìn lâu.
   - **Tối ưu Dark/Light Mode:** Cân chỉnh độ tương phản êm dịu, hài hòa chuẩn cấp doanh nghiệp (Enterprise Grade).
   - **Tận dụng tone Danger & Danger-soft phù hợp:** Cho phép dùng `Button variant="danger-soft"` (đỏ pastel nhạt dịu mắt chuẩn HeroUI v3) cho nút Đóng modal / Hủy thao tác để thể hiện rõ hành vi thoát bỏ mà không gây chói gắt (khi đó nút Xóa/Đặt lại bộ lọc chuyển sang `variant="outline"` hoặc `variant="ghost"`). Áp dụng `Button variant="danger"` cho hành vi Xóa bản ghi (Delete), Từ chối duyệt (Reject). Áp dụng `Chip color="danger" variant="soft"` cho các trạng thái quá hạn, trễ hạn, thất bại, vượt ngân sách hoặc rủi ro nghiêm trọng.
   - **Thông báo nghiệp vụ CRUD & Toast đồng nhất (Bắt buộc):** Toàn bộ thao tác tải dữ liệu (listing), thêm mới (create), cập nhật (update), xóa (delete) bắt buộc sử dụng bộ helper chuẩn hóa từ `@/components/common` (`notifyFetchSuccess`, `notifyCreateSuccess`, `notifyUpdateSuccess`, `notifyDeleteSuccess` hoặc `notify.*`, hoặc qua hook `useTableData({ entityName })`). Tuyệt đối không tự bịa câu chữ thông báo riêng lẻ hoặc dùng thẻ HTML tĩnh để đếm/báo kết quả. Vị trí hiển thị chuẩn: `Toast.Provider placement="top end"`.
5. **Quy tắc Styling với Tailwind CSS & Đơn vị đo**:
   - **Ưu tiên tuyệt đối:** Luôn ưu tiên dùng bảng class mặc định của Tailwind (ví dụ: `border-b-2`, `p-4`, `text-sm`, `gap-3`).
   - **Tùy biến với ngoặc vuông `[...]`:** Chỉ sử dụng khi không có class sẵn tương đương, và **bắt buộc dùng đơn vị `rem`** (ví dụ: `border-b-[0.1875rem]`, `w-[20rem]`).
   - **Cấm tiệt đơn vị `px`:** Tuyệt đối không dùng đơn vị `px` trong bất kỳ class nào.

---

## 7. QUY CHUẨN THIẾT KẾ MÀN HÌNH ĐỒNG BỘ (STANDARD PAGE LAYOUT & ZERO-DRIFT UI)

Mọi màn hình danh sách (Listing Screens / Table Views) trên toàn bộ hệ thống bắt buộc phải tuân thủ đồng bộ cấu trúc 5 tầng giao diện sau:

1. **TẦNG 1: TOP BAR ĐIỀU HƯỚNG & HÀNH ĐỘNG GỌN GÀNG (TOP BAR & QUICK ACTIONS):**
   - **Bên trái:** `Breadcrumb` định vị phân hệ và màn hình hiện tại.
   - **Bên phải:** Cụm nút hành động chính (`Button` kích thước `sm`): nút *"Làm mới dữ liệu"* (`variant="secondary"`) và nút *"Tạo mới / Thêm mới"* (`variant="primary"`).
   - **TUYỆT ĐỐI KHÔNG DÙNG HEADER CỒNG KỀNH:** Không tạo các khối tiêu đề `h1` to đùng kèm đoạn văn bản mô tả dài dòng làm đẩy nội dung chính xuống dưới, gây mất diện tích màn hình.

2. **TẦNG 2: THẺ THỐNG KÊ KPI NHANH (QUICK STATS CARDS):**
   - Dàn trang chuẩn: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4`.
   - **Bắt buộc sử dụng component dùng chung `StatCard` từ `@/components/common`**:
     - `variant="default"`: Thẻ tổng số / Bản ghi chung (`border-b-default-400`).
     - `variant="accent"`: Thẻ tiến trình / Đang chạy (`border-b-accent`).
     - `variant="success"`: Thẻ hoàn thành / Thành công (`border-b-success`).
     - `variant="primary"`: Thẻ tài chính / Doanh thu / Ngân sách (`border-b-primary`).
   - Tự động áp dụng `font-variant-numeric: tabular-nums` và hỗ trợ `isLoading`.

3. **TẦNG 3: BỘ LỌC & TÌM KIẾM DỮ LIỆU (FILTER & SEARCH BAR):**
   - Đặt gọn trong `Card className="p-4"`.
   - **Bên trái:** `Input` tìm kiếm từ khóa (tên, mã số, người phụ trách...).
   - **Bên phải:** Các `Select` lọc theo trạng thái / phân loại, kèm nút bật/tắt phân trang (*Phân trang: Bật / Tắt*).

4. **TẦNG 4: BẢNG DỮ LIỆU & STICKY HEADER CHỐNG TRÔI (TABLE & SCROLL CONTAINER):**
   - Đặt trong `Card className="overflow-hidden p-0"`.
   - Sử dụng Compound `Table` chuẩn HeroUI v3 nguyên bản từ `@/components/common`.
   - **Khống chế chiều cao & Scroll:** `Table.ScrollContainer` bắt buộc có `max-h-112 overflow-y-auto` (không để bảng dài lê thê làm mất tầm nhìn toàn trang). HeroUI v3 tự động ghim Header cố định khi cuộn.
   - **Sắp xếp cột (Sorting):** Sử dụng prop `allowsSorting` trên `Table.Column`, bọc tiêu đề cột trong `<Table.SortableColumnHeader sortDirection={sortDirection}>`. **Icon sắp xếp (chevron/indicator) đã được HeroUI tích hợp sẵn 100%, tuyệt đối không tự thêm icon mũi tên thủ công.**
   - **Căn lề dữ liệu:** Số/tiền/tiến độ canh phải (`text-right`), Ngày tháng/trạng thái canh giữa (`text-center`), Text/tên/mã canh trái (`text-left`). Tiêu đề cột `thead` dùng chữ thường (Sentence case / Title case nhẹ), KHÔNG viết hoa toàn bộ.
   - **Trạng thái trống (Empty State):** Bắt buộc dùng prop `renderEmptyState={() => <Table.EmptyState ... />}` từ `@/components/common`. **Tuyệt đối cấm render hàng `Table.Row` giả mạo kèm `colSpan`** để tránh xung đột với React Aria.

5. **TẦNG 5: THANH ĐIỀU KHIỂN PHÂN TRANG CHUẨN (STANDARD PAGINATION IN TABLE.FOOTER):**
   - **Bắt buộc sử dụng component dùng chung `Table.PaginationFooter` từ `@/components/common`** đặt trong thẻ `Table`:
     - Tự động gói chuẩn 3 khối: Chọn số bản ghi / trang (`Select size="sm"` bên trái), Thống kê số lượng (`Pagination.Summary` dạng `tabular-nums` ở giữa), và Bộ điều khiển chuyển trang HeroUI Compound (`Pagination.Content` kèm logic ellipsis bên phải).
     - Không tự viết lại hàm phân trang `renderPaginationItems` hay khối Footer thủ công.
   - **Cơ chế On/Off phân trang:** Mặc định luôn luôn là **Bật (default ON)**. Khi tắt, bảng hiển thị toàn bộ bản ghi và ẩn `Table.PaginationFooter`.


