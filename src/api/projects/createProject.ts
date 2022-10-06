import delay from '@utils/delay'
import { ProjectFormData } from '@utils/types'
// import __mockProjects__ from './__mockProjects__.json'

// const projects: Project[] = __mockProjects__ as Project[]

const createProject = async (project: ProjectFormData) => {
  await delay(800)
  return project
}
export default createProject
