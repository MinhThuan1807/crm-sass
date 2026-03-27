import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { AccessTokenPayload } from 'src/common/types/jwt.type'
import { ActivitiesService } from './activities.service'
import { CreateActivityBodyDto, CreateActivityResDto, GetActivitiesResDto } from './activities.dto'

@Controller('contacts/:contactId/activities') 
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ZodSerializerDto(CreateActivityResDto)
  createActivity(
    @CurrentUser() user: AccessTokenPayload,
    @Param('contactId') contactId: string,
    @Body() body: CreateActivityBodyDto,
  ) {
    return this.activitiesService.createActivity(
      user.tenantId,
      contactId,
      user.userId, // người đang đăng nhập tạo activity
      body,
    )
  }

  @Get()
  @ZodSerializerDto(GetActivitiesResDto)
  getActivities(
    @CurrentUser() user: AccessTokenPayload,
    @Param('contactId') contactId: string,
  ) {
    return this.activitiesService.getActivitiesByContact(user.tenantId, contactId)
  }
}