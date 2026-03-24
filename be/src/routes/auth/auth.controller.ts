import { Body, Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common'
import { Response, Request } from 'express'
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
  // @ZodSerializerDto(LoginResDto)
  // @ZodSerializerDto(LoginResDto)
  async login(
    @Body() body: LoginBodyDto,
    // passthrough to handle cookies in service layer
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(body)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, 
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    })
    // return { accessToken, refreshToken }
    return { message: 'Login successful' }
  }

  @Post('logout')
  @ZodSerializerDto(LogoutResDto)
  logout(
    // @Body() body: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    const refreshToken = req.cookies['refreshToken']

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    return this.authService.logout(refreshToken)
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
