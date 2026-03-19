import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

export const MyZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    console.log(error.issues)
   return  new UnprocessableEntityException(error.issues.map(issue => ({
      field: issue.path.join('.'),
      error: issue.message,
    })))

  }
})