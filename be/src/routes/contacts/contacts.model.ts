import z from "zod";

// ─────────────────────────────────────────
// BASE SCHEMAS — Không dùng trực tiếp làm Res/Body
// ─────────────────────────────────────────
const ContactBaseSchema = z.object({
  id:        z.string(),
  tenantId:  z.string(),
  name:      z.string().min(2).max(100),
  email:     z.string().email().optional(),
  phone:     z.string().optional(),
  company:   z.string().optional(),
  position:  z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

// ─────────────────────────────────────────
// CREATE — POST /contacts
// ─────────────────────────────────────────
export const CreateContactBodySchema = ContactBaseSchema
  .pick({ name: true, email: true, phone: true, company: true, position: true })
  .strict()

export const CreateContactResSchema = ContactBaseSchema
  .omit({ deletedAt: true })

export type CreateContactBodyType = z.infer<typeof CreateContactBodySchema>
export type CreateContactResType  = z.infer<typeof CreateContactResSchema>

// ─────────────────────────────────────────
// UPDATE — PATCH /contacts/:id
// ─────────────────────────────────────────
export const UpdateContactBodySchema = CreateContactBodySchema
  .partial()
  .refine(
    data => Object.keys(data).length > 0,
    { message: 'Ít nhất phải có một trường được cập nhật' }
  )

export const UpdateContactResSchema = CreateContactResSchema  // trả về giống Create

export type UpdateContactBodyType = z.infer<typeof UpdateContactBodySchema>
export type UpdateContactResType  = z.infer<typeof UpdateContactResSchema>

// ─────────────────────────────────────────
// GET ONE — GET /contacts/:id
// ─────────────────────────────────────────
export const GetContactResSchema = ContactBaseSchema
  .omit({ deletedAt: true })
  .extend({
    deals: z.array(z.object({
      id:    z.string(),
      title: z.string(),
      stage: z.string(),
      value: z.number(),
    })),
    activities: z.array(z.object({
      id:   z.string(),
      type: z.string(),
      note: z.string(),
      date: z.coerce.date(),
    })),
  })

export type GetContactResType = z.infer<typeof GetContactResSchema>

// ─────────────────────────────────────────
// GET ALL — GET /contacts
// ─────────────────────────────────────────
export const GetContactsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit:  z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
})

export const GetContactsResSchema = z.object({
  data: z.array(CreateContactResSchema),  // dùng lại, không expose deletedAt
  pagination: z.object({
    nextCursor: z.string().nullable(),
    hasNextPage: z.boolean(),
  }),
})

export type GetContactsQueryType = z.infer<typeof GetContactsQuerySchema>
export type GetContactsResType   = z.infer<typeof GetContactsResSchema>