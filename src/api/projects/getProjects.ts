import delay from '@utils/delay'
import { Project } from '@utils/types'
import __mockProjects__ from './__mockProjects__.json'

const projects: Project[] = __mockProjects__ as Project[]

const getProjects = async () => {
  await delay(800)
  return projects
}
export default getProjects
