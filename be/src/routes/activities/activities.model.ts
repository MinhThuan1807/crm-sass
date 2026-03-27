import z from 'zod'

// ─────────────────────────────────────────
// BASE
// ─────────────────────────────────────────
const ACTIVITIES_TYPES = {
  CALL: 'CALL',
  MEETING: 'MEETING',
  EMAIL: 'EMAIL',
  NOTE: 'NOTE',
} as const;

const ActivityEnum = z.enum([ACTIVITIES_TYPES.CALL, ACTIVITIES_TYPES.MEETING, ACTIVITIES_TYPES.EMAIL, ACTIVITIES_TYPES.NOTE])

const ActivityBaseSchema = z.object({
  id:        z.string(),
  tenantId:  z.string(),
  contactId: z.string().nullable(),
  dealId:    z.string().nullable(),
  userId:    z.string(),
  type:      ActivityEnum,
  note:      z.string(),
  date:      z.coerce.date(),
})

// ─────────────────────────────────────────
// CREATE — POST /contacts/:id/activities
// ─────────────────────────────────────────
export const CreateActivityBodySchema = z.object({
  type: ActivityEnum,
  note: z.string().min(1, 'Nội dung không được để trống'),
  date: z.coerce.date().optional(), // optional → default now()
}).strict()

export const CreateActivityResSchema = ActivityBaseSchema

export type CreateActivityBodyType = z.infer<typeof CreateActivityBodySchema>
export type CreateActivityResType  = z.infer<typeof CreateActivityResSchema>

// ─────────────────────────────────────────
// GET ALL — GET /contacts/:id/activities
// ─────────────────────────────────────────
export const GetActivitiesResSchema = z.object({
  data: z.array(ActivityBaseSchema),
})

export type GetActivitiesResType = z.infer<typeof GetActivitiesResSchema>