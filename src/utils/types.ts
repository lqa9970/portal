import { FormControlProps, TextFieldProps } from '@mui/material'
import { ControllerProps, FieldValues } from 'react-hook-form'

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

export type ProjectFormData = {
  applicationType: ApplicationType | string
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

export type ProjectItemStatus = 'queued' | 'pending' | 'success' | 'failure'
export type ProjectStatus = 'pending' | 'success' | 'failure'

// response type
type ApplicationType = 'public' | 'private'
type OperatingSystem = 'windows' | 'ubuntu'
type EnvironmentType = 'sandbox' | 'dev' | 'test' | 'qa' | 'prod'
type DataClassification = 'public' | 'internal' | 'confidential' | 'secret'

export type Project = {
  id: string
  applicationType?: ApplicationType
  status: ProjectStatus
  operatingSystem: OperatingSystem
  environmentType: EnvironmentType
  applicationShortName: string
  isSubscription?: boolean
  applicationDetail: string
  organizationUnit: string
  projectAdministrator: string
  costCenter: string
  isPrivacyData: boolean
  dataClassification: DataClassification
  cmdbApplicationName?: string
  cmdbApplicationId?: number
  supportPartner?: string
  at?: string
}
