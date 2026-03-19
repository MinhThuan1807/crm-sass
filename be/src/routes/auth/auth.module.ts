import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/common/common.module';
import { AuthRepository } from './auth.repo';

@Module({
  imports: [CommonModule],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController]
})
export class AuthModule {}
