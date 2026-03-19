import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'
import { HashingService } from 'src/common/services/hashing.service'
import { LoginBodyType, RefreshTokenBodyType, RegisterBodyType } from './auth.model'
import slugify from 'slugify'
import { ROLE } from 'src/common/constants/role.constanst'
import { SharedUserRepository } from 'src/common/repositories/shared-user.repo'
import { AccessTokenPayloadCreate, RefreshTokenPayload, RefreshTokenPayloadCreate } from 'src/common/types/jwt.type'
import { TokenService } from 'src/common/services/token.service'
import { AuthRepository } from './auth.repo'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(body: RegisterBodyType) {
    const slug = slugify(body.companyName)

    const existSlug = await this.sharedUserRepository.findSlug(slug)

    if (existSlug) {
      throw new ConflictException('Company name already exists')
    }

    const existUser = await this.authRepository.findUserByEmail(body.email)

    if (existUser) {
      throw new ConflictException('Email already exists')
    }

    const hashedPassword = await this.hashingService.hash(body.password)

    const user = await this.sharedUserRepository.createTenantIncludeUser({
      companyName: body.companyName,
      slug,
      email: body.email,
      name: body.name,
      hashedPassword,
      role: ROLE.ADMIN,
    })
    return user
  }

  async login(body: LoginBodyType) {
    const user = await this.authRepository.findUserByEmail(body.email)

    if (!user) {
      throw new UnauthorizedException()
    }

    const isPasswordValid = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          message: 'Invalid password',
          path: 'password',
        },
      ])
    }

    const tokens = await this.generateTokens({ userId: user.id, role: user.role, tenantId: user.tenantId })
    return tokens
  }

  async logout(refreshToken: string) {
    await this.authRepository.deleteRefreshToken(refreshToken);
    return { message: 'Logged out successfully' }
  }

  async generateTokens({ userId, role, tenantId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        role,
        tenantId,
      }),
      this.tokenService.signRefreshToken({ userId }),
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })

    return { accessToken, refreshToken }
  }

  async refreshToken(payload: RefreshTokenBodyType) {
    const { userId } = await this.tokenService.verifyRefreshToken(payload.refreshToken)

    const storedToken = await this.authRepository.findRefreshTokenIncludeUser(payload.refreshToken)

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const {
      user: { role, tenantId },
    } = storedToken

    const $deletedToken = this.authRepository.deleteRefreshToken(payload.refreshToken)

    const $tokens = this.generateTokens({ userId, role, tenantId })
    const [, tokens] = await Promise.all([$deletedToken, $tokens])
    return tokens
  }
}
