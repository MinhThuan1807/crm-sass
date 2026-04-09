# Tài liệu Yêu cầu: Deal Pipeline

## Giới thiệu

Module **Deal Pipeline** cung cấp API quản lý cơ hội bán hàng (deals) trong hệ thống CRM SaaS multi-tenant. Module cho phép sales team tạo, theo dõi và cập nhật deals theo từng giai đoạn (stage) trên kanban board, đồng thời xem đầy đủ thông tin liên quan gồm contact, tasks, activities và AI suggestions.

Module được xây dựng theo pattern của `contacts` module: controller → service → repo → dto, với multi-tenant isolation bắt buộc qua `tenantId`.

---

## Bảng thuật ngữ (Glossary)

- **Deal_API**: NestJS controller xử lý HTTP requests cho module deals
- **Deal_Service**: NestJS service chứa business logic của module deals
- **Deal_Repo**: NestJS repository thực hiện các truy vấn Prisma cho deals
- **Deal_Validator**: Zod schema validation cho input/output của deals
- **DealStage**: Enum gồm 5 giá trị: `PROSPECT`, `QUALIFIED`, `PROPOSAL`, `CLOSED_WON`, `CLOSED_LOST`
- **Pipeline_View**: Cấu trúc dữ liệu nhóm deals theo stage, dạng `{ PROSPECT: [...], QUALIFIED: [...], ... }`
- **CurrentUser**: Decorator lấy thông tin user (bao gồm `tenantId`, `userId`) từ JWT token
- **Soft_Delete**: Cơ chế xóa mềm bằng cách set `deletedAt = new Date()`, không xóa record khỏi DB
- **TenantId**: Định danh tenant dùng để cô lập dữ liệu giữa các tenant trong mọi query DB

---

## Yêu cầu

### Yêu cầu 1: Tạo Deal mới

**User Story:** Là một sales rep, tôi muốn tạo deal mới gắn với một contact và chỉ định owner, để theo dõi cơ hội bán hàng từ đầu.

#### Tiêu chí chấp nhận

1. WHEN một request `POST /deals` hợp lệ được gửi kèm `title`, `contactId`, `ownerId`, THE Deal_API SHALL tạo deal mới với `stage` mặc định là `PROSPECT` và trả về deal vừa tạo với HTTP 201.
2. THE Deal_Validator SHALL yêu cầu `title` là chuỗi từ 1 đến 200 ký tự, `contactId` là chuỗi không rỗng, và `ownerId` là chuỗi không rỗng.
3. THE Deal_Validator SHALL cho phép các trường tùy chọn: `value` (số thực không âm, mặc định 0), `closeDate` (ISO datetime), `note` (chuỗi tùy ý).
4. THE Deal_Repo SHALL gán `tenantId` từ `CurrentUser` vào deal khi tạo, không nhận `tenantId` từ request body.
5. IF `contactId` không tồn tại trong cùng `tenantId`, THEN THE Deal_Service SHALL trả về lỗi HTTP 404 với message mô tả rõ ràng.
6. IF `ownerId` không tồn tại trong cùng `tenantId`, THEN THE Deal_Service SHALL trả về lỗi HTTP 404 với message mô tả rõ ràng.

---

### Yêu cầu 2: Xem Pipeline theo Stage

**User Story:** Là một sales manager, tôi muốn xem tất cả deals được nhóm theo stage, để có cái nhìn tổng quan về pipeline bán hàng dạng kanban.

#### Tiêu chí chấp nhận

1. WHEN một request `GET /deals/pipeline` được gửi, THE Deal_API SHALL trả về object với đúng 5 key tương ứng 5 giá trị của `DealStage`: `PROSPECT`, `QUALIFIED`, `PROPOSAL`, `CLOSED_WON`, `CLOSED_LOST`.
2. THE Deal_Repo SHALL chỉ trả về deals có `deletedAt = null` và `tenantId` khớp với `CurrentUser`.
3. THE Deal_Service SHALL đảm bảo mỗi key trong Pipeline_View luôn tồn tại, kể cả khi không có deal nào ở stage đó (trả về mảng rỗng `[]`).
4. WHILE trả về Pipeline_View, THE Deal_API SHALL bao gồm các trường: `id`, `title`, `value`, `stage`, `closeDate`, `contact` (gồm `id`, `name`), `owner` (gồm `id`, `name`).
5. THE Deal_Repo SHALL sử dụng index `(tenantId, stage)` bằng cách query deals với `where: { tenantId, deletedAt: null }` và nhóm kết quả ở tầng service.

---

### Yêu cầu 3: Cập nhật Stage của Deal

**User Story:** Là một sales rep, tôi muốn kéo deal sang stage mới trên kanban board, để phản ánh tiến độ thực tế của cơ hội bán hàng.

#### Tiêu chí chấp nhận

1. WHEN một request `PATCH /deals/:id/stage` được gửi kèm `stage` hợp lệ, THE Deal_API SHALL cập nhật stage của deal và trả về deal đã cập nhật.
2. THE Deal_Validator SHALL chỉ chấp nhận `stage` là một trong 5 giá trị của enum `DealStage`; IF giá trị không hợp lệ được gửi, THEN THE Deal_Validator SHALL trả về lỗi HTTP 400 với danh sách các giá trị hợp lệ.
3. IF deal với `:id` không tồn tại trong `tenantId` của `CurrentUser` hoặc đã bị soft-deleted, THEN THE Deal_Service SHALL trả về lỗi HTTP 404.
4. THE Deal_Repo SHALL chỉ cập nhật trường `stage` và `updatedAt`, không thay đổi các trường khác của deal.

---

### Yêu cầu 4: Cập nhật thông tin Deal

**User Story:** Là một sales rep, tôi muốn chỉnh sửa thông tin chi tiết của deal như tiêu đề, giá trị, ngày đóng và ghi chú, để giữ dữ liệu luôn chính xác.

#### Tiêu chí chấp nhận

1. WHEN một request `PATCH /deals/:id` được gửi kèm ít nhất một trường hợp lệ, THE Deal_API SHALL cập nhật deal và trả về deal đã cập nhật.
2. THE Deal_Validator SHALL cho phép cập nhật một phần (partial update) với các trường: `title` (chuỗi 1–200 ký tự), `value` (số thực không âm), `closeDate` (ISO datetime hoặc null), `note` (chuỗi hoặc null).
3. IF request body rỗng hoặc không chứa trường nào được nhận, THEN THE Deal_Validator SHALL trả về lỗi HTTP 400 với message "Ít nhất phải có một trường được cập nhật".
4. IF deal với `:id` không tồn tại trong `tenantId` của `CurrentUser` hoặc đã bị soft-deleted, THEN THE Deal_Service SHALL trả về lỗi HTTP 404.
5. THE Deal_Repo SHALL không cho phép cập nhật `tenantId`, `contactId`, `ownerId`, hoặc `stage` qua endpoint này.

---

### Yêu cầu 5: Xem chi tiết Deal

**User Story:** Là một sales rep, tôi muốn xem đầy đủ thông tin của một deal bao gồm contact, tasks, activities và AI suggestions, để có đủ context khi làm việc với khách hàng.

#### Tiêu chí chấp nhận

1. WHEN một request `GET /deals/:id` được gửi, THE Deal_API SHALL trả về deal với đầy đủ các quan hệ: `contact`, `owner`, `tasks`, `activities`, `aiSuggestions`.
2. THE Deal_Repo SHALL include `contact` (toàn bộ trường), `owner` (chỉ `id`, `name`, `email`), `tasks` (sắp xếp theo `createdAt` tăng dần), `activities` (sắp xếp theo `date` giảm dần, tối đa 20 bản ghi), `aiSuggestions` (sắp xếp theo `createdAt` giảm dần).
3. IF deal với `:id` không tồn tại trong `tenantId` của `CurrentUser` hoặc đã bị soft-deleted, THEN THE Deal_Service SHALL trả về lỗi HTTP 404.
4. THE Deal_Validator SHALL không expose trường `deletedAt` trong response.

---

### Yêu cầu 6: Xóa mềm Deal

**User Story:** Là một sales rep, tôi muốn xóa deal không còn phù hợp mà không mất dữ liệu lịch sử, để có thể khôi phục nếu cần.

#### Tiêu chí chấp nhận

1. WHEN một request `DELETE /deals/:id` được gửi, THE Deal_API SHALL thực hiện Soft_Delete bằng cách set `deletedAt = new Date()` và trả về HTTP 200 với message xác nhận.
2. THE Deal_Repo SHALL không xóa record khỏi database; chỉ cập nhật trường `deletedAt`.
3. IF deal với `:id` không tồn tại trong `tenantId` của `CurrentUser` hoặc đã bị soft-deleted, THEN THE Deal_Service SHALL trả về lỗi HTTP 404.
4. WHILE `deletedAt` khác null, THE Deal_Repo SHALL loại trừ deal đó khỏi tất cả các query thông thường (pipeline, list, get by id).

---

### Yêu cầu 7: Bảo mật và Multi-Tenant Isolation

**User Story:** Là một system architect, tôi muốn đảm bảo mọi thao tác với deals đều được cô lập theo tenant, để dữ liệu của các công ty khác nhau không bị lẫn lộn.

#### Tiêu chí chấp nhận

1. THE Deal_API SHALL yêu cầu JWT authentication hợp lệ cho tất cả các endpoints; IF request không có token hoặc token không hợp lệ, THEN THE Deal_API SHALL trả về HTTP 401.
2. THE Deal_Repo SHALL luôn bao gồm điều kiện `tenantId` trong mệnh đề `where` của mọi query Prisma, không có ngoại lệ.
3. THE Deal_Service SHALL lấy `tenantId` và `userId` từ `CurrentUser` decorator, không nhận từ request params hoặc body.
4. IF một user cố truy cập deal thuộc tenant khác, THEN THE Deal_Service SHALL trả về HTTP 404 (không phải 403, để tránh lộ thông tin về sự tồn tại của resource).
