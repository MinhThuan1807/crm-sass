import { createZodDto } from "nestjs-zod";
import {
  CreateDealBodySchema,
  CreateDealResSchema,
  UpdateDealStageBodySchema,
  UpdateDealBodySchema,
  GetDealResSchema,
  GetDealsPipelineResSchema,
  UpdateDealResSchema,
} from "./deal.model";

export class CreateDealBodyDto extends createZodDto(CreateDealBodySchema) {}
export class CreateDealResDto extends createZodDto(CreateDealResSchema) {}

export class UpdateDealStageBodyDto extends createZodDto(
  UpdateDealStageBodySchema,
) {}
export class UpdateDealBodyDto extends createZodDto(UpdateDealBodySchema) {}
export class UpdateDealResDto extends createZodDto(UpdateDealResSchema) {}

export class GetDealResDto extends createZodDto(GetDealResSchema) {}
export class GetDealsPipelineResDto extends createZodDto(
  GetDealsPipelineResSchema,
) {}