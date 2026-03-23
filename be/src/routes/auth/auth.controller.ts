import { Body, Controller, Get, Post, UseGuards, Request, Req } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  LoginBodyDto,
  LoginResDto,
  RegisterBodyDto,
  RegisterResDto,
  RefreshTokenResDto,
  LogoutResDto,
} from './auth.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { ROLE } from 'src/common/constants/role.constanst'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user) {
    return user
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @Get('admin')
  getAdminProfile(@CurrentUser() user) {
    return { message: 'This route is only for ADMIN', user }
  }

}
