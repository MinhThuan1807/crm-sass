import { createZodDto } from 'nestjs-zod'
import { CreateActivityBodySchema, CreateActivityResSchema, GetActivitiesResSchema } from './activities.model'

export class CreateActivityBodyDto extends createZodDto(CreateActivityBodySchema) {}
export class CreateActivityResDto extends createZodDto(CreateActivityResSchema) {}
export class GetActivitiesResDto extends createZodDto(GetActivitiesResSchema) {}
