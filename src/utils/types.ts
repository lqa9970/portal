import { FormControlProps, TextFieldProps } from '@mui/material'
import { ControllerProps, FieldValues } from 'react-hook-form'
import { z } from 'zod'

// attempt fix type error when using custom field component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const ProjectSchema = z.object({
  rowKey: z.string(),
  applicationType: z.string(), // note this enum
  status: z.string(), // note this enum
  operatingSystem: z.string().nullable(), // note this enum
  environmentType: z.string(), // note this enum
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
  dataClassification: z.string(), // note this enum
  supportPartner: z.string().nullable(),
  timestamp: z.string(),
})

export type ProjectFormData = {
  applicationType: ApplicationType | string
  actionType: string
  isNewProjectNeeded?: boolean | string
  existingProject?: Project | null | undefined
  operatingSystem: OperatingSystem | string
  environmentType: EnvironmentType | string
  shouldCreateSubscription?: boolean | string
  applicationShortName: string
  applicationDetail: string
  organizationUnit: string
  projectAdministrator: string
  costCenter: string
  cmdbApplicationName?: string
  cmdbApplicationId?: string
  isPrivacyData: boolean | string
  dataClassification: DataClassification | string
  supportPartner?: string
}

export type ProjectStatus = 'In Progress' | 'Completed' | 'Error' | 'In Queue'

// response type
type ApplicationType = 'public' | 'private'
type OperatingSystem = 'windows' | 'ubuntu'
export type EnvironmentType = 'sandbox' | 'dev' | 'test' | 'qa' | 'prod'
type DataClassification = 'public' | 'internal' | 'confidential' | 'secret'

export type Project = z.infer<typeof ProjectSchema>

export type ProjectItemStatusResponse = {
  subItemOrderNumber: string
  rowKey: string
  status: ProjectStatus
  statusLine: string
  subItem: string
  subItemStatus: ProjectStatus
  timestamp: string
}
