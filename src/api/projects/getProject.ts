import delay from '@utils/delay'
import { Project } from '@utils/types'
import __mockProjects__ from './__mockProjects__.json'

const projects: Project[] = __mockProjects__ as Project[]

const getProject = async (id: string) => {
  await delay(800)
  return projects.find((project) => project.id === id) as Project
}
export default getProject
