import { ArrowBackIosNew } from '@mui/icons-material'
import { Button, Container } from '@mui/material'

import { Link as RouterLink, useParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'
import { getProject } from '@api'
import AddEnvironmentForm from './AddEnvironmentForm'
import Loading from '@components/Loading'

type Params = {
  projectId: string
}

const ProjectAddEnvironment = () => {
  const { projectId } = useParams() as Params
  const { data: project, status } = useQuery(['getProject', projectId], () =>
    getProject(projectId)
  )

  return (
    <Container sx={{ mt: '1.4rem' }}>
      <Button
        component={RouterLink}
        to={`/projects/${projectId}`}
        sx={{ ml: -2, mb: 2.5 }}
      >
        <ArrowBackIosNew sx={{ mr: 2 }} />
        Application details
      </Button>
      {status === 'loading' && <Loading />}
      {status === 'success' && <AddEnvironmentForm project={project} />}
    </Container>
  )
}

export default ProjectAddEnvironment
