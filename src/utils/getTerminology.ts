function capitalize(str: string) {
  const lower = str.toLowerCase()
  return `${str.charAt(0).toUpperCase()}${lower.slice(1)}`
}

const getTerminology = (val: string | boolean | undefined) => {
  switch (val) {
    case undefined:
      return ''
    case true:
      return 'Yes'
    case false:
      return 'No'
    case 'prod':
      return 'Production'
    case 'dev':
      return 'Development'
    case 'qa':
      return 'QA'
    default:
      if (typeof val === 'string') {
        return capitalize(val)
      }
      return ''
  }
}
export default getTerminology
