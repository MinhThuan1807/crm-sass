# làm sao để xác định tenant ? nếu thêm field tenantSlug, vậy khi login phải nhập tên công ty sao ? còn hướng giải quyết nào khác không

Đây là bài toán thiết kế thật sự của multi-tenant! Có nhiều cách, mỗi cách phù hợp với use case khác nhau.

Các hướng giải quyết phổ biến
*** Hướng 1 ***: Subdomain
company-abc.yourapp.com → tenantSlug = "company-abc"
company-xyz.yourapp.com → tenantSlug = "company-xyz"
FE đọc subdomain từ URL → gửi kèm vào request header. User không cần nhập gì thêm.

Ưu: UX tốt nhất, chuyên nghiệp Nhược: Phức tạp khi setup DNS, dev local khó test

*** Hướng 3 ***: Email globally unique — bỏ multi-tenant ở login
typescript// Email unique toàn hệ thống → tìm được luôn
const user = await prisma.user.findUnique({
  where: { email: body.email }
})

Đổi schema: bỏ `@@unique([tenantId, email])` → thêm `@unique` cho email.

**Ưu:** Đơn giản nhất
**Nhược:** Mất tính multi-tenant thuần túy — 2 công ty không thể dùng chung email

# Hướng 4: Mời qua link — không có login truyền thống
User được ADMIN mời → nhận email có link token → click vào tự động login đúng tenant.

**Ưu:** UX hiện đại
**Nhược:** Phức tạp, cần email service

# Bạn đang học và build một mình, nên:

Giai đoạn hiện tại  →  Hướng 3 (email globally unique)
Sau khi xong core   →  Nâng lên Hướng 1 (subdomain)



