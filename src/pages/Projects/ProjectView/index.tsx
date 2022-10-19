import { getProject } from '@api'
import Loading from '@components/Loading'
import { ArrowBackIosNew } from '@mui/icons-material'
import { Button, Container } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ProjectDetail from './components/ProjectDetail'

type Params = {
  rowKey: string
}

const ProjectView = () => {
  const { rowKey } = useParams() as Params
  const { t } = useTranslation()
  const { data, isLoading, isSuccess, isError } = useQuery(
    ['getProject', rowKey],
    () => getProject(rowKey)
  )

  return (
    <Container sx={{ mt: '1.4rem', overflow: 'hidden' }}>
      <Button component={RouterLink} to="/" sx={{ ml: -2, mb: 2.5 }}>
        <ArrowBackIosNew sx={{ mr: 2 }} />
        {t('home')}
      </Button>
      {isLoading && <Loading />}
      {isError && <div>{t('something.went.wrong')}!</div>}
      {isSuccess && <ProjectDetail project={data} />}
    </Container>
  )
}

export default ProjectView
