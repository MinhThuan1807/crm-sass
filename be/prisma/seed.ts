import * as bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma-client/client'
import { Role, DealStage, ActivityType, AiSuggestionType } from '../generated/prisma-client/enums'
import 'dotenv/config' // npm install dotenv nếu chưa có
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Bắt đầu seed data...')

  // ── 1. TENANT ────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'cong-ty-abc' },
    update: {},
    create: {
      name: 'Công ty ABC',
      slug: 'cong-ty-abc',
      plan: 'pro',
    },
  })
  console.log('✅ Tenant:', tenant.name)

  // ── 2. USERS ─────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Password123!', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@abc.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@abc.com',
      password: hashedPassword,
      name: 'Nguyễn Admin',
      role: Role.ADMIN,
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@abc.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'manager@abc.com',
      password: hashedPassword,
      name: 'Trần Manager',
      role: Role.MANAGER,
    },
  })

  const salesRep = await prisma.user.upsert({
    where: { email: 'sales@abc.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'sales@abc.com',
      password: hashedPassword,
      name: 'Lê Sales Rep',
      role: Role.SALES_REP,
    },
  })

  console.log('✅ Users: admin / manager / sales@abc.com (Password: Password123!)')

  // ── 3. CONTACTS ───────────────────────────────────────
  const contact1 = await prisma.contact.upsert({
    where: { id: 'contact-seed-001' },
    update: {},
    create: {
      id: 'contact-seed-001',
      tenantId: tenant.id,
      name: 'Phạm Văn Khách',
      email: 'khach@gmail.com',
      phone: '0901234567',
      company: 'Công ty XYZ',
      position: 'Giám đốc',
    },
  })

  const contact2 = await prisma.contact.upsert({
    where: { id: 'contact-seed-002' },
    update: {},
    create: {
      id: 'contact-seed-002',
      tenantId: tenant.id,
      name: 'Hoàng Thị Liên',
      email: 'lien@startup.vn',
      phone: '0912345678',
      company: 'Startup DEF',
      position: 'CTO',
    },
  })

  const contact3 = await prisma.contact.upsert({
    where: { id: 'contact-seed-003' },
    update: {},
    create: {
      id: 'contact-seed-003',
      tenantId: tenant.id,
      name: 'Đặng Minh Tuấn',
      email: 'tuan@enterprise.com',
      phone: '0987654321',
      company: 'Enterprise Corp',
      position: 'Trưởng phòng IT',
    },
  })

  console.log('✅ Contacts: 3 liên hệ')

  // ── 4. DEALS ──────────────────────────────────────────
  const deal1 = await prisma.deal.upsert({
    where: { id: 'deal-seed-001' },
    update: {},
    create: {
      id: 'deal-seed-001',
      tenantId: tenant.id,
      contactId: contact1.id,
      ownerId: salesRep.id,
      title: 'Triển khai CRM cho XYZ',
      value: 50000000,
      stage: DealStage.QUALIFIED,
      closeDate: new Date('2025-06-30'),
      note: 'Khách hàng quan tâm gói Pro',
    },
  })

  const deal2 = await prisma.deal.upsert({
    where: { id: 'deal-seed-002' },
    update: {},
    create: {
      id: 'deal-seed-002',
      tenantId: tenant.id,
      contactId: contact2.id,
      ownerId: salesRep.id,
      title: 'Tích hợp API cho Startup DEF',
      value: 20000000,
      stage: DealStage.PROPOSAL,
      closeDate: new Date('2025-05-15'),
      note: 'Đã gửi proposal, chờ phản hồi',
    },
  })

  const deal3 = await prisma.deal.upsert({
    where: { id: 'deal-seed-003' },
    update: {},
    create: {
      id: 'deal-seed-003',
      tenantId: tenant.id,
      contactId: contact3.id,
      ownerId: manager.id,
      title: 'Nâng cấp hệ thống Enterprise Corp',
      value: 150000000,
      stage: DealStage.CLOSED_WON,
      closeDate: new Date('2025-04-01'),
      note: 'Đã ký hợp đồng',
    },
  })

  console.log('✅ Deals: 3 deals (QUALIFIED / PROPOSAL / CLOSED_WON)')

  // ── 5. ACTIVITIES ─────────────────────────────────────
  await prisma.activity.createMany({
    data: [
      // Activities gắn contact1
      {
        tenantId: tenant.id,
        contactId: contact1.id,
        dealId: deal1.id,
        userId: salesRep.id,
        title: 'Tư vấn gói Pro',
        type: ActivityType.CALL,
        note: 'Gọi điện tư vấn gói Pro, khách hàng đồng ý demo',
        date: new Date('2025-04-01T09:00:00'),
      },
      {
        tenantId: tenant.id,
        contactId: contact1.id,
        dealId: deal1.id,
        userId: salesRep.id,
        title: 'Gửi báo giá',
        type: ActivityType.EMAIL,
        note: 'Gửi email báo giá và tài liệu sản phẩm',
        date: new Date('2025-04-02T10:30:00'),
      },
      {
        tenantId: tenant.id,
        contactId: contact1.id,
        userId: salesRep.id,
        title: 'Demo sản phẩm',
        type: ActivityType.MEETING,
        note: 'Demo sản phẩm tại văn phòng khách hàng',
        date: new Date('2025-04-05T14:00:00'),
      },
      // Activities gắn contact2
      {
        tenantId: tenant.id,
        contactId: contact2.id,
        dealId: deal2.id,
        userId: salesRep.id,
        title: 'Ghi chú tích hợp Zalo OA',
        type: ActivityType.NOTE,
        note: 'Khách cần tích hợp Zalo OA, cần confirm thêm',
        date: new Date('2025-04-03T11:00:00'),
      },
      {
        tenantId: tenant.id,
        contactId: contact2.id,
        dealId: deal2.id,
        userId: salesRep.id,
        title: 'Follow up proposal',
        type: ActivityType.CALL,
        note: 'Follow up sau khi gửi proposal, khách đang review',
        date: new Date('2025-04-06T16:00:00'),
      },
      // Activities gắn contact3
      {
        tenantId: tenant.id,
        contactId: contact3.id,
        dealId: deal3.id,
        userId: manager.id,
        title: 'Họp ký hợp đồng',
        type: ActivityType.MEETING,
        note: 'Họp ký hợp đồng, bàn giao timeline dự án',
        date: new Date('2025-04-01T09:00:00'),
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Activities: 6 hoạt động (CALL / EMAIL / MEETING / NOTE)')

  // ── 6. TASKS ──────────────────────────────────────────
  await prisma.task.createMany({
    data: [
      {
        dealId: deal1.id,
        title: 'Gửi proposal chính thức',
        done: false,
        dueDate: new Date('2025-04-10'),
      },
      {
        dealId: deal1.id,
        title: 'Setup demo environment',
        done: true,
        dueDate: new Date('2025-04-05'),
      },
      {
        dealId: deal2.id,
        title: 'Viết tài liệu kỹ thuật API',
        done: false,
        dueDate: new Date('2025-04-12'),
      },
      {
        dealId: deal3.id,
        title: 'Bàn giao tài liệu hợp đồng',
        done: true,
        dueDate: new Date('2025-04-02'),
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Tasks: 4 tasks')

  // ── 7. AI SUGGESTIONS ─────────────────────────────────
  await prisma.aiSuggestion.createMany({
    data: [
      {
        dealId: deal1.id,
        type: AiSuggestionType.EMAIL_DRAFT,
        content: 'Kính gửi anh Khách, cảm ơn anh đã dành thời gian tham dự buổi demo...',
        sourceNote: 'Demo sản phẩm tại văn phòng khách hàng',
      },
      {
        dealId: deal1.id,
        type: AiSuggestionType.TASK_LIST,
        content: JSON.stringify(['Gửi email follow-up sau demo', 'Chuẩn bị báo giá chính thức', 'Lên lịch họp lần 2']),
        sourceNote: 'Demo sản phẩm tại văn phòng khách hàng',
      },
      {
        dealId: deal2.id,
        type: AiSuggestionType.SUMMARY,
        content: 'Deal đang ở giai đoạn PROPOSAL. Khách cần tích hợp Zalo OA. Cần follow up tuần tới.',
        sourceNote: 'Follow up sau khi gửi proposal',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ AI Suggestions: 3 gợi ý')

  // ── SUMMARY ───────────────────────────────────────────
  console.log('\n📋 THÔNG TIN ĐĂNG NHẬP TEST:')
  console.log('┌─────────────────────────────────────────────┐')
  console.log('│  Role     │ Email            │ Password     │')
  console.log('├─────────────────────────────────────────────┤')
  console.log('│  ADMIN    │ admin@abc.com    │ Password123! │')
  console.log('│  MANAGER  │ manager@abc.com  │ Password123! │')
  console.log('│  SALES    │ sales@abc.com    │ Password123! │')
  console.log('└─────────────────────────────────────────────┘')

  console.log('\n🔗 IDs để test API:')
  console.log('Tenant ID   :', tenant.id)
  console.log('Contact IDs :', contact1.id, '|', contact2.id, '|', contact3.id)
  console.log('Deal IDs    :', deal1.id, '|', deal2.id, '|', deal3.id)
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('✅ Seed hoàn tất!') // thêm dòng này
  })
