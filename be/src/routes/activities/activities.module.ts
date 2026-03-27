import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitiesRepository } from './activities.repo';
import { PrismaService } from 'src/common/services/prisma.service';
import { ContactsRepository } from '../contacts/contacts.repo';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesRepository,ActivitiesService, PrismaService, ContactsRepository]
})
export class ActivitiesModule {}
