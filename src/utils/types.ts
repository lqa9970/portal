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
  environmentType: EnvironmentTypeEnum,
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
  applicationType: z.string().min(1, 'Required'),
  isNewProjectNeeded: z.boolean().optional().nullable(),
  existingProject: ProjectSchema.optional().nullable(),
  environmentType: z.string().min(1, 'Required'),
  applicationShortName: z
    .string()
    .min(1, 'Required')
    .max(4, 'Max 4 characters')
    .regex(/^[A-Z]+$/i, 'Only letters'),
  applicationDetail: z.string().min(1, 'Required'),
  organizationUnit: z.string().min(1, 'Required'),
  projectAdministrator: z.string().min(1, 'Required'),
  costCenter: z.string().min(1, 'Required').regex(/^\d+$/, 'number'),
  isPrivacyData: z.boolean().or(z.string().min(1, 'Required')),
  dataClassification: z.string().min(1, 'Required'),
})
const CreateProjectFormDataSchema = z.object({
  applicationType: z.string().min(1, 'Required'),
  operatingSystem: z.string().min(1, 'Required'),
  shouldCreateSubscription: z.boolean(),
  environmentType: z.string().min(1, 'Required'),
  applicationShortName: z
    .string()
    .min(1, 'Required')
    .max(4, 'Max 4 characters')
    .regex(/^[A-Z]+$/i, 'Only letters'),
  applicationDetail: z.string().min(1, 'Required'),
  organizationUnit: z.string().min(1, 'Required'),
  projectAdministrator: z.string().min(1, 'Required'),
  costCenter: z.string().min(1, 'Required').regex(/^\d+$/, 'Numbers only'),
  cmdbApplicationName: z.string().min(1, 'Required'),
  cmdbApplicationId: z
    .string()
    .min(1, 'Required')
    .regex(/^\d+$/, 'Numbers only'),
  isPrivacyData: z.boolean().or(z.string().min(1, 'Required')),
  dataClassification: z.string().min(1, 'Required'),
  supportPartner: z.string().min(1, 'Required'),
})
export const CreateFormDataSchema = z.discriminatedUnion('actionType', [
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
