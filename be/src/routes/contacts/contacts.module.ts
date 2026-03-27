import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactsRepository } from './contacts.repo';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, ContactsRepository, PrismaService]
})
export class ContactsModule {}
