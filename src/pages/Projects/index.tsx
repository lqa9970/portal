import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Box,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemButton,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2'
import {
  Add,
  Check,
  Search,
  ArrowForwardIos,
  ErrorOutline,
  Cached,
  PendingActions,
} from '@mui/icons-material'

import { useState } from 'react'
import { ProjectStatus } from '@utils/types'
import usePersistedState from '@utils/usePersistedState'
import { useAccount } from '@azure/msal-react'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@api'
import Loading from '@components/Loading'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import i18n from '@utils/locales/i18n'

function getDateStringFromStatus(status: ProjectStatus, timestamp: string) {
  const date = new Date(timestamp)
  const dateString = format(date, 'MM/dd/yyyy')
  const { t } = i18n
  switch (status) {
    case 'In Queue':
      return t('in.queue') as string
    case 'Error':
      return `${t('failed.at')} ${dateString}` as string
    case 'In Progress':
      return t('in.progress') as string
    case 'Completed':
      return `${t('successfully.created.at')} ${dateString}` as string
  }
}

function getIconFromStatus(status: ProjectStatus) {
  switch (status) {
    case 'In Queue':
      return <PendingActions />
    case 'Error':
      return <ErrorOutline color="error" />
    case 'In Progress':
      return <Cached />
    case 'Completed':
      return <Check color="success" />
  }
}

const getProjectTemplates = () => {
  const { t } = i18n
  return [
    {
      name: t('sandbox.template.name') as string,
      type: t('sandbox.template.type') as string,
      helperText: t('sandbox.template.helperText') as string,
      description: t('sandbox.template.description') as string,
      ctaString: t('sandbox.template.ctaString') as string,
    },
    {
      name: t('project.template.name') as string,
      type: t('project.template.type') as string,
      helperText: t('project.template.helperText') as string,
      description: t('project.template.description') as string,
      ctaString: t('project.template.ctaString') as string,
    },
  ]
}

const Projects = () => {
  const account = useAccount()
  const { t } = useTranslation()
  const [filterText, setFilterText] = useState('')
  const [isViewingOwnProject, setIsViewingOwnProject] = usePersistedState(
    'isViewingOwnProject',
    true
  )
  const { data, isLoading, isSuccess } = useQuery(
    ['getProjects', isViewingOwnProject],
    () => getProjects({ isViewingOwnProject })
  )
  const filterProjects = data?.filter(({ applicationName }) =>
    applicationName.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <Container sx={{ mt: '4.306rem' }}>
      <Typography variant="h5" sx={{ mb: 5 }}>
        {t('welcome')}, {account?.name}
      </Typography>
      <Grid sx={{ mb: 8 }} container spacing={4}>
        {getProjectTemplates().map(
          ({ name, helperText, description, ctaString, type }) => (
            <Grid key={name} xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box minHeight={90}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.15rem',
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography variant="subtitle2">{helperText}</Typography>
                  </Box>
                  <Box minHeight={60}>
                    <Typography color="text.secondary" variant="subtitle2">
                      {description}
                    </Typography>
                  </Box>
                  <Button
                    sx={{ ml: 0 }}
                    startIcon={<Add />}
                    component={RouterLink}
                    to={`create/${type}`}
                  >
                    {ctaString}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      <Grid sx={{ mb: 5 }} container spacing={4}>
        <Grid sx={{ my: 'auto' }} xs={12} sm={6}>
          <Typography variant="h6">{t('existing.projects')}</Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isViewingOwnProject}
                  onChange={(event) => {
                    setIsViewingOwnProject(event.target.checked)
                  }}
                  inputProps={{
                    'aria-label': 'view own project only',
                  }}
                />
              }
              labelPlacement="start"
              label={t('only.created.by.you')}
            />
          </FormGroup>
        </Grid>
        <Grid xs={12} sm={4}>
          <TextField
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
            placeholder={t('filter.by.name')}
            fullWidth
          />
        </Grid>
      </Grid>
      <Box width="100%">
        {isLoading && <Loading />}
        {isSuccess && (
          <List>
            {filterProjects?.map(
              ({ applicationName, rowKey, timestamp, status }) => (
                <div key={rowKey}>
                  <ListItem
                    divider
                    secondaryAction={
                      <IconButton
                        component={RouterLink}
                        to={rowKey}
                        edge="end"
                        aria-label="cta"
                      >
                        <ArrowForwardIos />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      // sx={{ gap: 4 }}
                      component={RouterLink}
                      to={rowKey}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-around"
                        width="100%"
                        maxWidth={300}
                      >
                        <ListItemText
                          primary={applicationName}
                          secondary={getDateStringFromStatus(status, timestamp)}
                        />
                      </Box>
                      {getIconFromStatus(status)}
                    </ListItemButton>
                  </ListItem>
                </div>
              )
            )}
          </List>
        )}
      </Box>
    </Container>
  )
}

export default Projects
