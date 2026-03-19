import { ROLE } from "src/common/constants/role.constanst";
import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.enum([ROLE.ADMIN, ROLE.MANAGER, ROLE.SALES_REP]),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserType = z.infer<typeof UserSchema>;

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
}).extend({
  confirmPassword: z.string(),
  companyName: z.string(),
}).strict().superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords do not match',
    })
  }
});

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export const RegisterResSchema = UserSchema.omit({
  password: true,
})

export type RegisterResType = z.infer<typeof RegisterResSchema>;

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict();

export type LoginBodyType = z.infer<typeof LoginBodySchema>;

export const LoginResSchema = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
})

export type LoginResType = z.infer<typeof LoginResSchema>;

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.string(),
  // tenantId: z.string(),
  // expireAt: z.date()
})


export const RefreshTokenBodySchema = z.object({
  refreshToken: z.string(),
}).strict();

export const RefreshTokenResSchema = LoginResSchema

export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;
export type RefreshTokenResType = z.infer<typeof RefreshTokenResSchema>;
