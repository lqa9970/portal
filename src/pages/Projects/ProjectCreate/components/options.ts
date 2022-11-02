import { CreateFormData, RadioOption, SelectOption } from '@utils/types'

export const sandboxDefaultValues: CreateFormData = {
  actionType: 'create-sandbox',
  applicationType: 'public',
  isNewProjectNeeded: true,
  existingProject: null,
  environmentType: 'sandbox',
  applicationShortName: '',
  applicationDetail: '',
  organizationUnit: '',
  applicationAdministrator: '',
  costCenter: '',
  isPrivacyData: '',
  dataClassification: 'public',
}
export const projectDefaultValues: CreateFormData = {
  actionType: 'create-project',
  applicationType: '',
  operatingSystem: '',
  environmentType: 'dev',
  shouldCreateSubscription: false,
  applicationShortName: '',
  applicationDetail: '',
  organizationUnit: '',
  applicationAdministrator: '',
  costCenter: '',
  cmdbApplicationName: '',
  cmdbApplicationId: '',
  isPrivacyData: '',
  dataClassification: '',
  infrastructureVendor: 'Nordcloud',
  applicationVendor: '',
}

export const sandboxApplicationTypeOptions: RadioOption[] = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private', disabled: true },
]

export const sandboxDataClassification: RadioOption[] = [
  { label: 'Public', value: 'public' },
  { label: 'Internal', value: 'internal', disabled: true },
  {
    label: 'Confidential',
    value: 'confidential',
    disabled: true,
  },
  { label: 'Secret', value: 'secret', disabled: true },
]

export const projectApplicationTypeOptions: RadioOption[] = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
]

export const projectDataClassification: RadioOption[] = [
  { label: 'Public', value: 'public' },
  { label: 'Internal', value: 'internal' },
  { label: 'Confidential', value: 'confidential' },
  { label: 'Secret', value: 'secret' },
]

export const operatingSystemOptions: SelectOption[] = [
  {
    label: 'Windows',
    value: 'windows',
  },
  {
    label: 'Ubuntu',
    value: 'ubuntu',
  },
]

export const environmentTypeOptions: RadioOption[] = [
  {
    label: 'Dev',
    value: 'dev',
  },
  {
    label: 'Test',
    value: 'test',
    disabled: true,
  },
  {
    label: 'QA',
    value: 'qa',
    disabled: true,
  },
  {
    label: 'Prod',
    value: 'prod',
    disabled: true,
  },
]

export const yesNoOptions: RadioOption[] = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
]
