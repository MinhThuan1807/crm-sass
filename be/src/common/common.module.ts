import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';

const sharedProviders = PrismaService;
// const sharedProviders = [PrismaService];

@Module({
  providers: [sharedProviders],
  exports: [sharedProviders],
})
export class CommonModule {}
