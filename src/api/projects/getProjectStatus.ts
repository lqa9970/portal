import delay from '@utils/delay'
import { ProjectItemStatus } from '@utils/types'

const statuses: {
  label: string
  status: ProjectItemStatus
}[] = [
  {
    label: 'Create DevOps Project',
    status: 'success',
  },
  {
    label: 'Create Azure Resource Group',
    status: 'pending',
  },
  {
    label: 'Create Service Connection',
    status: 'queued',
  },
  { label: 'Create Wiki', status: 'queued' },
  { label: 'Create Repository', status: 'queued' },
  {
    label: 'Create DevOps Groups',
    status: 'queued',
  },
  { label: 'Create AD Groups', status: 'queued' },
  {
    label: 'Link AD Groups and DevOps Groups',
    status: 'queued',
  },
]

const getProjectStatus = async (projectId: string) => {
  console.log(projectId)
  delay(800)
  return statuses
}

export default getProjectStatus
