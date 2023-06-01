import i18n from '@utils/locales/i18n'
import { CreateFormData, RadioOption, SelectOption } from '@utils/types'

// i18n text
const { t } = i18n

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
  shouldCreateDomain: false,
  applicationShortName: '',
  applicationDetail: '',
  organizationUnit: '',
  applicationAdministrator: '',
  costCenter: '',
  cmdbSystemName: '',
  cmdbSystemId: '',
  isPrivacyData: '',
  dataClassification: '',
  infrastructureVendor: 'Nordcloud',
  applicationVendor: '',
}

export const sandboxApplicationTypeOptions: RadioOption[] = [
  { label: t('public'), value: 'public' },
  { label: 'Private', value: 'private', disabled: true },
]

export const sandboxDataClassification: RadioOption[] = [
  { label: t('public'), value: 'public' },
  { label: t('internal'), value: 'internal' },
  {
    label: t('confidential'),
    value: 'confidential',
  },
  { label: t('secret'), value: 'secret' },
]

export const projectApplicationTypeOptions: RadioOption[] = [
  { label: t('public'), value: 'public' },
  { label: t('private'), value: 'private' },
]

export const projectDataClassification: RadioOption[] = [
  { label: t('public'), value: 'public' },
  { label: t('internal'), value: 'internal' },
  { label: t('confidential'), value: 'confidential' },
  { label: t('secret'), value: 'secret' },
]

export const operatingSystemOptions: SelectOption[] = [
  {
    label: t('windows'),
    value: 'windows',
  },
  {
    label: t('linux'),
    value: 'linux',
  },
]

export const domainOptions: RadioOption[] = [
  {
    label: t('IT'),
    value: 'IT',
  },
  {
    label: t('Domain'),
    value: 'Domain',
  },
]

export const environmentTypeOptions: RadioOption[] = [
  {
    label: t('dev'),
    value: 'dev',
  },
  {
    label: t('tst'),
    value: 'tst',
  },
  {
    label: t('qa'),
    value: 'qa',
  },
  {
    label: t('prd'),
    value: 'prd',
  },
]

export const yesNoOptions: RadioOption[] = [
  {
    label: t('yes'),
    value: true,
  },
  {
    label: t('no'),
    value: false,
  },
]

export const yesNoOptionsDisableNo: RadioOption[] = [
  {
    label: t('yes'),
    value: true,
  },
  {
    label: t('no'),
    value: false,
    disabled: true,
  },
]
