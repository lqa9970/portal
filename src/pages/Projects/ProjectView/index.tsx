import { getProject } from '@api'
import Loading from '@components/Loading'
import { ArrowBackIosNew } from '@mui/icons-material'
import { Button, Container } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ProjectDetail from './components/ProjectDetail'

type Params = {
  projectId: string
}

const ProjectView = () => {
  const { projectId } = useParams() as Params
  const { data, status } = useQuery(['getProject', projectId], () =>
    getProject(projectId)
  )

  return (
    <Container sx={{ mt: '1.4rem' }}>
      <Button component={RouterLink} to="/" sx={{ ml: -2, mb: 2.5 }}>
        <ArrowBackIosNew sx={{ mr: 2 }} />
        Home
      </Button>
      {status === 'loading' && <Loading />}
      {status === 'error' && <div>something went wrong!</div>}
      {status === 'success' && <ProjectDetail project={data} />}
    </Container>
  )
}

export default ProjectView
