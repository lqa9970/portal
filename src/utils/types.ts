import { FormControlProps, TextFieldProps } from '@mui/material'
import { ControllerProps, FieldValues } from 'react-hook-form'
import { z } from 'zod'
import i18n from './locales/i18n'

// i18n text
const { t } = i18n
const requiredText = t('required') as string
const applicationShortNameMaxChar = t(
  'application.short.name.max.character'
) as string
const applicationShortNameOnlyLetter = t(
  'application.short.name.only.letter'
) as string
const costCenterHelper = t('cost.center.helper') as string
const cmdbSystemIdHelper = t('cmdb.system.id.helper') as string

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
const EnvironmentTypeEnum = z.enum(['sandbox', 'dev', 'tst', 'qa', 'prd'])

export const ProjectSchema = z.object({
  rowKey: z.string(),
  applicationType: z.enum(['public', 'private']),
  status: ProjectStatusEnum,
  operatingSystem: z.enum(['windows', 'linux']).nullable(),
  environmentType: EnvironmentTypeEnum,
  applicationName: z.string(),
  applicationShortName: z.string(),
  shouldCreateSubscription: z.boolean(),
  applicationDetail: z.string(),
  organizationUnit: z.string(),
  applicationAdministrator: z.string(),
  costCenter: z.string(),
  cmdbSystemName: z.string().nullable(),
  cmdbSystemId: z.string().nullable(),
  isPrivacyData: z.boolean(),
  dataClassification: z.enum(['public', 'internal', 'confidential', 'secret']),
  infrastructureVendor: z.string().nullable(),
  applicationVendor: z.string().nullable(),
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
  applicationType: z.string().min(1, requiredText),
  isNewProjectNeeded: z.boolean().optional().nullable(),
  existingProject: ProjectSchema.optional().nullable(),
  environmentType: z.string().min(1, requiredText),
  applicationShortName: z
    .string()
    .min(1, requiredText)
    .max(4, applicationShortNameMaxChar)
    .regex(/^[A-Z]+$/i, applicationShortNameOnlyLetter),
  applicationDetail: z.string().min(1, requiredText),
  organizationUnit: z.string().min(1, requiredText),
  applicationAdministrator: z.string().min(1, requiredText),
  costCenter: z.string().min(1, requiredText).regex(/^\d+$/, costCenterHelper),
  isPrivacyData: z.boolean().or(z.string().min(1, requiredText)),
  dataClassification: z.string().min(1, requiredText),
})
const CreateProjectFormDataSchema = z.object({
  applicationType: z.string().min(1, requiredText),
  operatingSystem: z.string().min(1, requiredText),
  shouldCreateSubscription: z.boolean(),
  environmentType: z.string().min(1, requiredText),
  applicationShortName: z
    .string()
    .min(1, requiredText)
    .max(4, applicationShortNameMaxChar)
    .regex(/^[A-Z]+$/i, applicationShortNameOnlyLetter),
  applicationDetail: z.string().min(1, requiredText),
  organizationUnit: z.string().min(1, requiredText),
  applicationAdministrator: z.string().min(1, requiredText),
  costCenter: z.string().min(1, requiredText).regex(/^\d+$/, costCenterHelper),
  cmdbSystemName: z.string().min(1, requiredText),
  cmdbSystemId: z
    .string()
    .min(1, requiredText)
    .regex(/^\d+$/, cmdbSystemIdHelper),
  isPrivacyData: z.boolean().or(z.string().min(1, requiredText)),
  dataClassification: z.string().min(1, requiredText),
  infrastructureVendor: z.string().min(1, requiredText),
  applicationVendor: z.string().min(1, requiredText),
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

export const AddEnvFormDataSchema = z.object({
  environmentType: z.string().min(1, requiredText),
  costCenter: z.string().min(1, requiredText).regex(/^\d+$/, costCenterHelper),
})

export type CreateFormData = z.infer<typeof CreateFormDataSchema>
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>
export type EnvironmentType = z.infer<typeof EnvironmentTypeEnum>

// response type
export type Project = z.infer<typeof ProjectSchema>
export type ProjectItemStatus = z.infer<typeof ProjectItemStatusScehma>
