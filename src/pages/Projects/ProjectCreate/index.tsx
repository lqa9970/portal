import { ArrowBackIosNew } from '@mui/icons-material'
import { Button, Container, Typography } from '@mui/material'
import { useParams, Link as RouterLink } from 'react-router-dom'
import CreateForm from './components/CreateForm'

const ProjectCreate = () => {
  const { type } = useParams()
  const isSandbox = type === 'sandbox'
  return (
    <Container sx={{ mt: '1.4rem' }}>
      <Button component={RouterLink} to="/" sx={{ ml: -2, mb: 2.5 }}>
        <ArrowBackIosNew sx={{ mr: 2 }} />
        Home
      </Button>
      <Typography variant="h5" sx={{ mb: 5 }}>
        New {isSandbox ? 'Sandbox' : 'Project'}
      </Typography>
      <CreateForm />
    </Container>
  )
}

export default ProjectCreate
