import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'
import { CreateActivityBodyType } from './activities.model'

@Injectable()
export class ActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, contactId: string, userId: string, data: CreateActivityBodyType) {
    return this.prisma.activity.create({
      data: {
        tenantId,
        contactId,  
        userId,
        title: data.title,
        type: data.type,
        note: data.note,
        date: data.date ?? new Date(), 
      },  
    })
  }

  findAllByContact(tenantId: string, contactId: string) {
    return this.prisma.activity.findMany({
      where: { tenantId, contactId },
      orderBy: { date: 'desc' }, 
      include: {
        user: {
          select: { id: true} // ai tạo activity
        }
      }
    })
  }
}