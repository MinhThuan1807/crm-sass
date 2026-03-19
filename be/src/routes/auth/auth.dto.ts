import { createZodDto } from "nestjs-zod";
import { LoginBodySchema, LoginResSchema, RefreshTokenResSchema, RegisterBodySchema, RegisterResSchema } from './auth.model';
import { MessageSchema } from "src/common/dto/message.dto";

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}
export class RegisterResDto extends createZodDto(RegisterResSchema) {}

export class LoginBodyDto extends createZodDto(LoginBodySchema) {}
export class LoginResDto extends createZodDto(LoginResSchema) {}

export class RefreshTokenResDto extends createZodDto(RefreshTokenResSchema) {}

export class LogoutResDto extends createZodDto(MessageSchema) {}
