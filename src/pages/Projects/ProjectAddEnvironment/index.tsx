import { ArrowBackIosNew } from '@mui/icons-material'
import { Button, Container } from '@mui/material'

import { Link as RouterLink, useParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'
import { getProject } from '@api'
import AddEnvironmentForm from './components/AddEnvironmentForm'
import Loading from '@components/Loading'
import { useTranslation } from 'react-i18next'

type Params = {
  rowKey: string
}

const ProjectAddEnvironment = () => {
  const { t } = useTranslation()
  const { rowKey } = useParams() as Params
  const {
    data: project,
    isLoading,
    isSuccess,
  } = useQuery(['getProject', rowKey], () => getProject(rowKey))

  return (
    <Container sx={{ mt: '1.4rem' }}>
      <Button
        component={RouterLink}
        to={`/projects/${rowKey}`}
        sx={{ ml: -2, mb: 2.5 }}
      >
        <ArrowBackIosNew sx={{ mr: 2 }} />
        {project?.applicationShortName}
        <>&nbsp;</>
        {t('env.details')}
      </Button>
      {isLoading && <Loading />}
      {isSuccess && <AddEnvironmentForm project={project} />}
    </Container>
  )
}

export default ProjectAddEnvironment
