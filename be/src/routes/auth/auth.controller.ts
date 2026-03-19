import { Body, Controller, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { LoginBodyDto, LoginResDto, RegisterBodyDto, RegisterResDto, RefreshTokenResDto, LogoutResDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }

  @Post('login')
  @ZodSerializerDto(LoginResDto)
  login(@Body() body: LoginBodyDto) {
    return this.authService.login(body)
  }

  @Post('logout')
  @ZodSerializerDto(LogoutResDto)
  logout(@Body() body: { refreshToken: string }) {
    return this.authService.logout(body.refreshToken)
  }

  @Post('refresh-token')
  @ZodSerializerDto(RefreshTokenResDto)
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body)
  }
}
