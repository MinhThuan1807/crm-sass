import { Injectable, NotFoundException } from '@nestjs/common'
import { ActivitiesRepository } from './activities.repo'
import { CreateActivityBodyType } from './activities.model'
import { ContactsRepository } from '../contacts/contacts.repo'

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly contactsRepository: ContactsRepository,
  ) {}

  async createActivity(tenantId: string, contactId: string, userId: string, body: CreateActivityBodyType) {
    // Check contact thuộc tenant này không
    const contact = await this.contactsRepository.findOne(contactId, tenantId)

    if (!contact) throw new NotFoundException('Hợp đồng không tồn tại')

    return this.activitiesRepository.create(tenantId, contactId, userId, body)
  }

  async getActivitiesByContact(tenantId: string, contactId: string) {
    const contact = await this.contactsRepository.findOne(contactId, tenantId)

    if (!contact) throw new NotFoundException('Hợp đồng không tồn tại')

    const data = await this.activitiesRepository.findAllByContact(tenantId, contactId)

    return { data }
  }
}
