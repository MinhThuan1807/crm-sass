import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';
import { HashingService } from './services/hashing.service';
import { SharedUserRepository } from './repositories/shared-user.repo';
import { JwtModule } from '@nestjs/jwt';

// const sharedProviders = PrismaService;
const sharedProviders = [PrismaService, TokenService, HashingService , SharedUserRepository];

@Module({
   imports: [
    JwtModule.register({}), 
  ],
  providers: [...sharedProviders],
  exports: sharedProviders,
})
export class CommonModule {}
