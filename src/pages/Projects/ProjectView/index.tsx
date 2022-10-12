import { getProject } from '@api'
import Loading from '@components/Loading'
import { ArrowBackIosNew } from '@mui/icons-material'
import { Button, Container } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ProjectDetail from './components/ProjectDetail'

type Params = {
  rowKey: string
}

const ProjectView = () => {
  const { rowKey } = useParams() as Params
  const { data, isLoading, isSuccess, isError } = useQuery(
    ['getProject', rowKey],
    () => getProject(rowKey)
  )

  return (
    <Container sx={{ mt: '1.4rem', overflow: 'hidden' }}>
      <Button component={RouterLink} to="/" sx={{ ml: -2, mb: 2.5 }}>
        <ArrowBackIosNew sx={{ mr: 2 }} />
        Home
      </Button>
      {isLoading && <Loading />}
      {isError && <div>something went wrong!</div>}
      {isSuccess && <ProjectDetail project={data} />}
    </Container>
  )
}

export default ProjectView
