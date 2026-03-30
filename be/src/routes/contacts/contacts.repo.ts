import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'
import { CreateContactBodyType, GetContactsQueryType } from './contacts.model'

@Injectable()
export class ContactsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(tenantId: string, data: CreateContactBodyType) {
    return this.prismaService.contact.create({
      data: {
        tenantId,
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        company: data.company ?? null,
        position: data.position ?? null,
      },
    })
  }

  findAll(tenantId: string, query: GetContactsQueryType) {
    return this.prismaService.contact.findMany({
      where: {
        tenantId,
        deletedAt: null,
        OR: query.search
          ? [
              { name: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: {
        deals: { where: { deletedAt: null } },
        activities: { orderBy: { date: 'desc' }, take: 10 },
      },
      take: query.limit + 1, // lấy thêm 1 để biết còn trang tiếp không
      cursor: query.cursor ? { id: query.cursor } : undefined,
      skip: query.cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
    })
  }

  findOne(contactId: string, tenantId: string) {
    return this.prismaService.contact.findFirst({
      where: { id: contactId, tenantId, deletedAt: null },
      include: {
        deals: { where: { deletedAt: null } },
        activities: { orderBy: { date: 'desc' }, take: 10 },
      },
    })
  }

  update(contactId: string, tenantId: string, data: Partial<CreateContactBodyType>) {
    return this.prismaService.contact.update({
      where: { id: contactId, tenantId, deletedAt: null },
      data: { ...data },
    })
  }

  // xoa mềm, chỉ cập nhật trường deletedAt
  delete(contactId: string, tenantId: string) {
    return this.prismaService.contact.update({
      where: { id: contactId, tenantId },
      data: { deletedAt: new Date() },
    })
  }

  findDeleted(contactId: string, tenantId: string) {
    return this.prismaService.contact.findFirst({
      where: { id: contactId, tenantId, deletedAt: { not: null } },
    })
  }
  restore(contactId: string, tenantId: string) {
    return this.prismaService.contact.update({
      where: { id: contactId, tenantId },
      data: { deletedAt: null },
    })
  }
}
