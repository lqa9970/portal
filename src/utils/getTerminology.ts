import i18n from './locales/i18n'

const getTerminology = (val: string | boolean | undefined | null) => {
  const { t } = i18n
  switch (val) {
    case true:
      return t('yes') as string
    case false:
      return t('no') as string
    default:
      if (typeof val === 'string') {
        return t(val) as string
      }
      return ''
  }
}
export default getTerminology
