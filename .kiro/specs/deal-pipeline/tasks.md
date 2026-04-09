# Kế hoạch triển khai: Deal Pipeline

## Tổng quan

Triển khai module Deal Pipeline theo pattern `controller → service → repo → model → dto → module` của dự án. Mỗi bước xây dựng tăng dần, kết thúc bằng việc wire toàn bộ module vào app.

## Tasks

- [X] 1. Tạo Zod schemas và DTOs cho deals module
  - Tạo file `be/src/routes/deals/deals.model.ts` với đầy đủ schemas: `CreateDealBodySchema`, `UpdateDealStageBodySchema`, `UpdateDealBodySchema`, `GetDealResSchema`, `GetDealsPipelineResSchema`
  - Tạo file `be/src/routes/deals/deals.dto.ts` với các DTO classes dùng `createZodDto`
  - Import `DealStage` từ `generated/prisma-client`, không phải `@prisma/client`
  - _Requirements: 1.2, 1.3, 2.4, 3.2, 4.2, 4.3, 5.4_

  - [ ]\* 1.1 Viết property test cho Zod schema validation (Property 2, 8, 10)
    - **Property 2: Validation input tạo deal — reject title rỗng/quá dài, contactId/ownerId rỗng, value âm**
    - **Property 8: Enum validation — reject stage không thuộc DealStage**
    - **Property 10: Forbidden fields bị reject bởi strict schema**
    - **Validates: Requirements 1.2, 1.3, 3.2, 4.5**

- [X] 2. Tạo DealsRepository
  - Tạo file `be/src/routes/deals/deals.repo.ts`
  - Implement `findAllByTenant(tenantId)` — query với `where: { tenantId, deletedAt: null }`, include contact/owner select
  - Implement `findOne(dealId, tenantId)` — full relations (contact, owner, tasks, activities take:20, aiSuggestions)
  - Implement `create(tenantId, data)` — gán `stage: DealStage.PROSPECT` cứng, không nhận từ body
  - Implement `updateStage(dealId, tenantId, stage)` — chỉ update trường `stage`
  - Implement `update(dealId, tenantId, data)` — partial update các trường cho phép
  - Implement `softDelete(dealId, tenantId)` — set `deletedAt: new Date()`
  - Mọi query đều phải có `where.tenantId`
  - _Requirements: 1.4, 2.2, 2.5, 3.4, 4.5, 5.2, 6.2, 7.2_

  - [ ]\* 2.1 Viết property test cho tenantId isolation (Property 3, 5)
    - **Property 3: tenantId luôn lấy từ JWT — deal tạo ra có tenantId đúng dù body có chứa tenantId hay không**
    - **Property 5: Soft-deleted deals không xuất hiện trong findAllByTenant và findOne**
    - **Validates: Requirements 1.4, 2.2, 6.4, 7.2, 7.3**

- [X] 3. Tạo DealsService
  - Tạo file `be/src/routes/deals/deals.service.ts`
  - Implement `getPipeline(tenantId)` — gọi `findAllByTenant`, nhóm deals theo stage với object khởi tạo đủ 5 key = `[]`
  - Implement `getDealById(dealId, tenantId)` — gọi `findOne`, throw `NotFoundException` nếu null
  - Implement `createDeal(tenantId, body)` — validate contact tồn tại trong tenant, validate owner tồn tại trong tenant, rồi gọi `create`
  - Implement `updateDealStage(dealId, tenantId, stage)` — kiểm tra deal tồn tại, gọi `updateStage`
  - Implement `updateDeal(dealId, tenantId, body)` — kiểm tra deal tồn tại, gọi `update`
  - Implement `deleteDeal(dealId, tenantId)` — kiểm tra deal tồn tại (chưa bị xóa), gọi `softDelete`
  - Dùng `PrismaService` trực tiếp để validate contact/owner (không tạo dependency vòng)
  - _Requirements: 1.5, 1.6, 2.3, 3.3, 4.4, 5.3, 6.3, 7.4_

  - [ ]\* 3.1 Viết property test cho pipeline grouping (Property 4, 6)
    - **Property 4: Pipeline luôn có đủ 5 stage keys dù tenant không có deal nào**
    - **Property 6: Mỗi deal card trong pipeline có đủ các trường id, title, value, stage, closeDate, contact, owner**
    - **Validates: Requirements 2.1, 2.3, 2.4**

  - [ ]\* 3.2 Viết property test cho update operations (Property 7, 9)
    - **Property 7: updateDealStage chỉ thay đổi trường stage, các trường khác giữ nguyên**
    - **Property 9: Partial update đúng — trường được gửi được cập nhật, trường không gửi giữ nguyên**
    - **Validates: Requirements 3.1, 3.4, 4.1, 4.2**

- [ ] 4. Checkpoint — Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi user nếu có thắc mắc.

- [ ] 5. Tạo DealsController
  - Tạo file `be/src/routes/deals/deals.controller.ts`
  - Khai báo `@Controller('deals')` và `@UseGuards(JwtAuthGuard)`
  - Implement `GET /deals/pipeline` — **phải đặt trước** `GET /deals/:id`
  - Implement `GET /deals/:id`
  - Implement `POST /deals`
  - Implement `PATCH /deals/:id/stage` — **phải đặt trước** `PATCH /deals/:id`
  - Implement `PATCH /deals/:id`
  - Implement `DELETE /deals/:id` — trả về `{ message: 'Deal đã được xóa thành công' }`
  - Dùng `@ZodSerializerDto` cho mọi endpoint, lấy `tenantId`/`userId` từ `@CurrentUser()`
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 7.3_

  - [ ]\* 5.1 Viết unit tests cho controller endpoints
    - Test `POST /deals` body hợp lệ → 201 + deal với stage PROSPECT
    - Test `POST /deals` title rỗng → 400
    - Test `GET /deals/pipeline` tenant không có deal → 5 key đều là `[]`
    - Test `DELETE /deals/:id` → 200, sau đó `GET /deals/:id` → 404
    - Test `PATCH /deals/:id/stage` stage không hợp lệ → 400
    - Test `GET /deals/:id` không có token → 401
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_

  - [ ]\* 5.2 Viết property test cho soft delete và cross-tenant isolation (Property 12, 13)
    - **Property 12: Sau khi DELETE /deals/:id — deal không xuất hiện trong pipeline, GET trả về 404, record vẫn còn trong DB**
    - **Property 13: Cross-tenant isolation — user tenant B truy cập deal tenant A nhận 404**
    - **Validates: Requirements 6.1, 6.2, 6.4, 7.4**

  - [ ]\* 5.3 Viết property test cho deal detail (Property 11)
    - **Property 11: GET /deals/:id trả về đủ relations, tasks sort createdAt asc, activities sort date desc tối đa 20, không có deletedAt**
    - **Validates: Requirements 5.1, 5.2, 5.4**

- [ ] 6. Tạo DealsModule và wire vào AppModule
  - Tạo file `be/src/routes/deals/deals.module.ts` với đầy đủ providers: `DealsController`, `DealsService`, `DealsRepository`, `PrismaService`
  - Import `DealsModule` vào `be/src/app.module.ts`
  - _Requirements: 7.1, 7.2_

- [ ] 7. Checkpoint cuối — Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi user nếu có thắc mắc.

## Ghi chú

- Tasks đánh dấu `*` là tùy chọn, có thể bỏ qua để ra MVP nhanh hơn
- Mỗi task tham chiếu requirements cụ thể để đảm bảo traceability
- Property tests dùng thư viện **fast-check**, tối thiểu 100 iterations mỗi test
- Mỗi property test phải có comment tag: `// Feature: deal-pipeline, Property {N}: {mô tả}`
- Import Prisma client từ `generated/prisma-client`, không phải `@prisma/client`
