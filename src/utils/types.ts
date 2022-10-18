import { FormControlProps, TextFieldProps } from '@mui/material'
import { ControllerProps, FieldValues } from 'react-hook-form'
import { z } from 'zod'

// attempt fix type error when using custom field component
type ControllerWithoutRender<T extends FieldValues> = Omit<
  ControllerProps<T>,
  'render'
>

export type CustomTextFieldProps<T extends FieldValues> = TextFieldProps &
  ControllerWithoutRender<T> & {
    // custom props
    description?: string
    options?: SelectOption[]
  }

export type SelectOption = {
  label: string
  value: string
}
export type RadioOption = {
  label: string
  value: string | boolean
  disabled?: boolean
}

export type CustomRadioInputProps<T extends FieldValues> =
  ControllerWithoutRender<T> & {
    // custom props
    FormControlProps?: FormControlProps
    label?: string
    description?: string
    options: RadioOption[]
  }

const ProjectStatusEnum = z.enum([
  'In Progress',
  'Completed',
  'Error',
  'In Queue',
])
const EnvironmentTypeEnum = z.enum(['sandbox', 'dev', 'test', 'qa', 'prod'])

export const ProjectSchema = z.object({
  rowKey: z.string(),
  applicationType: z.enum(['public', 'private']),
  status: ProjectStatusEnum,
  operatingSystem: z.enum(['windows', 'ubuntu']).nullable(),
  environmentType: z.enum(['sandbox', 'dev', 'test', 'qa', 'prod']),
  applicationName: z.string(),
  applicationShortName: z.string(),
  shouldCreateSubscription: z.boolean(),
  applicationDetail: z.string(),
  organizationUnit: z.string(),
  projectAdministrator: z.string(),
  costCenter: z.string(),
  cmdbApplicationName: z.string().nullable(),
  cmdbApplicationId: z.string().nullable(),
  isPrivacyData: z.boolean(),
  dataClassification: z.enum(['public', 'internal', 'confidential', 'secret']),
  supportPartner: z.string().nullable(),
  timestamp: z.string(),
})

export const ProjectItemStatusScehma = z.object({
  subItemOrderNumber: z.string(),
  rowKey: z.string(),
  status: ProjectStatusEnum,
  statusLine: z.string(),
  subItem: z.string(),
  subItemStatus: ProjectStatusEnum,
  timestamp: z.string(),
})

const CreateSandboxFormDataSchema = z.object({
  applicationType: z.string(), // note this enum
  isNewProjectNeeded: z.boolean().optional(),
  existingProject: ProjectSchema.optional().nullable(),
  environmentType: z.string(), // note this enum
  applicationShortName: z
    .string()
    .regex(/[a-zA-Z]/gi, 'Only letters')
    .max(4, 'Max 4 characters'),
  applicationDetail: z.string(),
  organizationUnit: z.string(),
  projectAdministrator: z.string(),
  costCenter: z.string().regex(/^\d+$/, 'number'),
  isPrivacyData: z.boolean().nullable(),
  dataClassification: z.string(), // note this enum
})
const CreateProjectFormDataSchema = z.object({
  applicationType: z.string(), // note this enum
  operatingSystem: z.string(), // note this enum
  // note this enum
  shouldCreateSubscription: z.boolean(),
  environmentType: z.string(), // note this enum
  applicationShortName: z
    .string()
    .regex(/[a-zA-Z]/gi, 'Only letters')
    .max(4, 'Max 4 characters'),
  applicationDetail: z.string(),
  organizationUnit: z.string(),
  projectAdministrator: z.string(),
  costCenter: z.string().regex(/^\d+$/, 'Numbers only'),
  cmdbApplicationName: z.string(),
  cmdbApplicationId: z.string().regex(/^\d+$/, 'Numbers only'),
  isPrivacyData: z.boolean().nullable(),
  dataClassification: z.string(), // note this enum
  supportPartner: z.string(),
})
const CreateFormDataSchema = z.discriminatedUnion('actionType', [
  CreateSandboxFormDataSchema.extend({
    actionType: z.literal('create-sandbox'),
  }),
  CreateProjectFormDataSchema.extend({
    actionType: z.literal('create-project'),
  }),
  CreateProjectFormDataSchema.extend({
    actionType: z.literal('add-env'),
  }),
])

export type CreateFormData = z.infer<typeof CreateFormDataSchema>
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>
export type EnvironmentType = z.infer<typeof EnvironmentTypeEnum>

// response type
export type Project = z.infer<typeof ProjectSchema>
export type ProjectItemStatus = z.infer<typeof ProjectItemStatusScehma>
