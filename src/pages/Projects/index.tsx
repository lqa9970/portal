import {
  Button,
  ButtonGroup,
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
  ErrorOutline,
  Cached,
  PendingActions,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material'

import { useState, useEffect } from 'react'
import { ProjectStatus, Project, UserRole } from '@utils/types'
import usePersistedState from '@utils/usePersistedState'
import { useAccount } from '@azure/msal-react'
import { useQuery } from '@tanstack/react-query'
import { getProjectEnvList, getUserRole } from '@api'
import Loading from '@components/Loading'
import { useTranslation } from 'react-i18next'
import i18n from '@utils/locales/i18n'

// function getDateStringFromStatus(status: ProjectStatus, timestamp: string) {
//   const date = new Date(timestamp)
//   const dateString = format(date, 'MM/dd/yyyy')
//   const { t } = i18n
//   switch (status) {
//     case 'In Queue':
//       return t('in.queue') as string
//     case 'Error':
//       return `${t('failed.at')} ${dateString}` as string
//     case 'In Progress':
//       return t('in.progress') as string
//     case 'Completed':
//       return `${t('successfully.created.at')} ${dateString}` as string
//   }
// }

type Env = {
  environmentType: string
  rowKey: string
  status: ProjectStatus
  isAlreadyCreated: boolean
}

type RoleProps = {
  role?: UserRole
  apps?: Project[]
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

const RoleRenderCreate = ({ role }: RoleProps) => {
  const sandboxView = getProjectTemplates()[0]
  const projectView = getProjectTemplates()[1]
  const { t } = useTranslation()

  switch (role) {
    case 'FullViewer':
      return (
        <>
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
                        <Typography variant="subtitle2">
                          {helperText}
                        </Typography>
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
                        data-cy={`create-${type}`}
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
        </>
      )
    case 'ProjectViewer':
      return (
        <>
          <Grid sx={{ mb: 8 }} container spacing={4}>
            <Card sx={{ maxWidth: 500 }}>
              <CardContent>
                <Box minHeight={90}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.15rem',
                    }}
                  >
                    {projectView.name}
                  </Typography>
                  <Typography variant="subtitle2">
                    {projectView.helperText}
                  </Typography>
                </Box>
                <Box minHeight={60}>
                  <Typography color="text.secondary" variant="subtitle2">
                    {projectView.description}
                  </Typography>
                </Box>
                <Button
                  sx={{ ml: 0 }}
                  startIcon={<Add />}
                  component={RouterLink}
                  data-cy={`create-${projectView.type}`}
                  to={`create/${projectView.type}`}
                >
                  {projectView.ctaString}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </>
      )
    case 'SandboxViewer':
      return (
        <>
          <Grid sx={{ mb: 8 }} container spacing={4}>
            <Card sx={{ maxWidth: 500 }}>
              <CardContent>
                <Box minHeight={90}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.15rem',
                    }}
                  >
                    {sandboxView.name}
                  </Typography>
                  <Typography variant="subtitle2">
                    {sandboxView.helperText}
                  </Typography>
                </Box>
                <Box minHeight={60}>
                  <Typography color="text.secondary" variant="subtitle2">
                    {sandboxView.description}
                  </Typography>
                </Box>
                <Button
                  sx={{ ml: 0 }}
                  startIcon={<Add />}
                  component={RouterLink}
                  data-cy={`create-${sandboxView.type}`}
                  to={`create/${sandboxView.type}`}
                >
                  {sandboxView.ctaString}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </>
      )
    case 'InvalidUser':
      return <p>{t('you.cant.create.env')}</p>
    default:
      return null
  }
}

const getProjectTemplates = () => {
  const { t } = i18n
  return [
    {
      name: t('card.sandbox.template.name') as string,
      type: t('card.sandbox.template.type') as string,
      helperText: t('card.sandbox.template.helperText') as string,
      description: t('card.sandbox.template.description') as string,
      ctaString: t('card.sandbox.template.ctaString') as string,
    },
    {
      name: t('card.project.template.name') as string,
      type: t('card.project.template.type') as string,
      helperText: t('card.project.template.helperText') as string,
      description: t('card.project.template.description') as string,
      ctaString: t('card.project.template.ctaString') as string,
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
  const [roleFilteredApps, setRoleFilteredApps] = useState<
    Array<Project> | undefined
  >([])

  const [isAscending, setIsAscending] = useState(true)

  const {
    data: applications,
    isLoading,
    isSuccess,
  } = useQuery(['getProjectEnvList', isViewingOwnProject], () =>
    getProjectEnvList({ isViewingOwnProject })
  )

  const { data: userRole } = useQuery(['getUserRole'], () => getUserRole())

  const filterApplications = applications
    ?.filter(({ applicationShortName }) =>
      applicationShortName.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort(
      (a, b) =>
        (isAscending ? 1 : -1) *
        a.applicationShortName.localeCompare(b.applicationShortName)
    )

  useEffect(() => {
    switch (userRole) {
      case 'FullViewer':
        setRoleFilteredApps(filterApplications)
        break
      case 'SandboxViewer':
        setRoleFilteredApps(
          filterApplications?.filter((app) => app.type == 'Sandbox')
        )
        break
      case 'ProjectViewer':
        setRoleFilteredApps(
          filterApplications?.filter((app) => app.type == 'Project')
        )
        break
      case 'InvalidUser':
        setRoleFilteredApps([])
        break
      default:
        break
    }
  }, [filterApplications])

  const getRowKey = (app: Project) => {
    for (let i = 0; i < app.environmentGroup.length; i++) {
      if (app.environmentGroup[i].rowKey !== null) {
        return app.environmentGroup[i].rowKey
      }
    }
  }

  return (
    <Container sx={{ mt: '4.306rem' }}>
      <Typography variant="h5" sx={{ mb: 5 }}>
        {t('welcome')}, {account?.name}
      </Typography>

      <RoleRenderCreate role={userRole} />

      <Grid sx={{ mb: 5 }} container spacing={4}>
        <Grid sx={{ my: 'auto' }} xs={12} sm={6}>
          <Typography variant="h6">{t('existing.applications')}</Typography>
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
        <Grid xs={12}>
          <Box display="flex" alignItems="center" gap={4}>
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
              sx={{ maxWidth: '300px', width: '100%', minWidth: '200px' }}
            />

            {isAscending ? (
              <IconButton onClick={() => setIsAscending(false)}>
                <ArrowUpward sx={{ fontSize: '2.4rem' }} />
              </IconButton>
            ) : (
              <IconButton onClick={() => setIsAscending(true)}>
                <ArrowDownward sx={{ fontSize: '2.4rem' }} />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
      <Box width="100%" my={10}>
        {isLoading && <Loading />}
        {isSuccess && roleFilteredApps?.length === 0 && (
          <Box textAlign="center">
            <Loading />
          </Box>
        )}
        {isSuccess && roleFilteredApps?.length != 0 && (
          <List>
            {roleFilteredApps?.map((app: Project, index) => (
              <div key={index}>
                <ListItem divider disablePadding>
                  <ListItem
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-around"
                      width="100%"
                      maxWidth={40}
                    >
                      <ListItemText
                        sx={{ textTransform: 'uppercase', m: 1 }}
                        primary={app.applicationShortName}
                      />
                    </Box>
                    <Box
                      display="flex"
                      alignItems="left"
                      justifyContent="space-around"
                      width="100%"
                      maxWidth={260}
                    >
                      <ListItemText
                        sx={{ color: '#737373', m: 0.8 }}
                        primary={app.cmdbSystemName}
                      />
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                      maxWidth={300}
                      sx={{ mr: 2, pr: 2 }}
                    >
                      {app.environmentGroup[0].environmentType == 'sandbox' ? (
                        <ButtonGroup
                          variant="outlined"
                          color="inherit"
                          aria-label="outlined button group"
                        >
                          <Button
                            variant="outlined"
                            component={RouterLink}
                            to={app.environmentGroup[0].rowKey}
                            sx={{
                              width: 120,
                              m: 1.5,
                              display: 'flex',
                              gap: '4px',
                            }}
                          >
                            {app.environmentGroup[0].environmentType}
                            {getIconFromStatus(app.environmentGroup[0].status)}
                          </Button>
                        </ButtonGroup>
                      ) : (
                        <ButtonGroup
                          variant="outlined"
                          color="inherit"
                          aria-label="outlined button group"
                        >
                          {app.environmentGroup.map(
                            (env: Env, index: number) => {
                              if (!env.rowKey) {
                                return (
                                  <div key={index}>
                                    <Button
                                      variant="outlined"
                                      component={RouterLink}
                                      to={`${getRowKey(
                                        app
                                      )}/add-environment/env=${
                                        env.environmentType
                                      }`}
                                      sx={{
                                        width: 70,
                                        m: 1.5,
                                        color: 'text.disabled',
                                      }}
                                    >
                                      {env.environmentType.toUpperCase()}
                                    </Button>
                                  </div>
                                )
                              } else {
                                return (
                                  <div key={env.rowKey}>
                                    <Button
                                      variant="outlined"
                                      component={RouterLink}
                                      to={env.rowKey}
                                      sx={{
                                        width: 70,
                                        m: 1.5,
                                        gap: '2px',
                                      }}
                                    >
                                      {env.environmentType.toUpperCase()}
                                      {getIconFromStatus(env.status)}
                                    </Button>
                                  </div>
                                )
                              }
                            }
                          )}
                        </ButtonGroup>
                      )}
                    </Box>
                  </ListItem>
                </ListItem>
              </div>
            ))}
          </List>
        )}
      </Box>
    </Container>
  )
}

export default Projects
