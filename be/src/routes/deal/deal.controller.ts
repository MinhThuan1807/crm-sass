import { Body, Controller, Patch, Post, UseGuards, Get, Delete, Param } from '@nestjs/common';
import { CreateDealBodyType, DealStageType, UpdateDealBodyType } from './deal.model';
import { DealService } from './deal.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { CreateDealBodyDto, CreateDealResDto, GetDealResDto, GetDealsPipelineResDto, UpdateDealResDto } from './deal.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AccessTokenPayload } from 'src/common/types/jwt.type';
import { MessageDto } from 'src/common/dto/message.dto';

@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post()
  @ZodSerializerDto(CreateDealResDto)
  create(@Body() body: CreateDealBodyType, @CurrentUser() user: AccessTokenPayload) {
    return this.dealService.create(user.tenantId, {...body});
  }

  @Get('pipeline')
  @ZodSerializerDto(GetDealsPipelineResDto)
  getPipeline(@CurrentUser() user: AccessTokenPayload) {
    return this.dealService.getPipleline(user.tenantId);
  }

  @Get(':id')
  @ZodSerializerDto(GetDealResDto)
  getDealById(@Param("id") dealId: string, @CurrentUser() user: AccessTokenPayload) {
    return this.dealService.getDealById(dealId, user.tenantId);
  }
   
  @Patch(':id/stage')
  @ZodSerializerDto(UpdateDealResDto)
  updateStage(@Param("id") dealId: string, @CurrentUser() user: AccessTokenPayload, @Body() body: { stage: DealStageType }) {
    return this.dealService.updateDealStage(dealId, user.tenantId, body.stage);
  }

  @Patch(':id')
  @ZodSerializerDto(UpdateDealResDto)
  update(@Param("id") dealId: string, @CurrentUser() user: AccessTokenPayload, @Body() body: UpdateDealBodyType) {
    return this.dealService.update(dealId, user.tenantId, body);
  }

  @Delete(':id')
  @ZodSerializerDto(MessageDto)
  delete(@Param("id") dealId: string, @CurrentUser() user: AccessTokenPayload) {
    return this.dealService.delete(dealId, user.tenantId);
  }

}
