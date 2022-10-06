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
} from '@mui/icons-material'

import __mockProjectTemplates__ from './__mockProjectTemplates__.json'

import { useState } from 'react'
import { ProjectStatus } from '@utils/types'
import usePersistedState from '@utils/usePersistedState'
import { useAccount } from '@azure/msal-react'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@api'
import Loading from '@components/Loading'

function getDateStringFromStatus(status: ProjectStatus, at?: string) {
  switch (status) {
    case 'failure':
      return `Failed at ${at}`
    case 'pending':
      return 'In progress'
    case 'success':
      return `Successfully created at ${at}`
  }
}

function getIconFromStatus(status: ProjectStatus) {
  switch (status) {
    case 'failure':
      return <ErrorOutline color="error" sx={{ ml: 4 }} />
    case 'pending':
      return <Cached sx={{ ml: 4 }} />
    case 'success':
      return <Check color="success" sx={{ ml: 4 }} />
  }
}

const Projects = () => {
  const account = useAccount()

  const [filterText, setFilterText] = useState('')
  const [isViewingOwnProject, setIsViewingOwnProject] = usePersistedState(
    'isViewingOwnProject',
    true
  )

  const { data, status } = useQuery(['getProjects'], getProjects)

  const filterProjects = data?.filter(
    ({ applicationShortName, environmentType }) =>
      `${applicationShortName}-${environmentType}`
        .toLowerCase()
        .includes(filterText.toLowerCase())
  )

  return (
    <Container sx={{ mt: '4.306rem' }}>
      <Typography variant="h5" sx={{ mb: 5 }}>
        Welcome, {account?.name}
      </Typography>
      <Grid sx={{ mb: 8 }} container spacing={4}>
        {__mockProjectTemplates__.map(
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
        <Grid sx={{ my: 'auto' }} xs={12} sm={8}>
          <Typography variant="h6">Existing projects</Typography>
        </Grid>
        <Grid xs={12} sm={4}>
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
              label="Only created by you"
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
            placeholder="Filter by name"
            fullWidth
          />
        </Grid>
      </Grid>
      <Box width="100%">
        {status === 'loading' && <Loading />}
        <List>
          {filterProjects?.map(
            ({ applicationShortName, environmentType, id, at, status }) => (
              <div key={id}>
                <ListItem
                  divider
                  secondaryAction={
                    <IconButton
                      component={RouterLink}
                      to={id}
                      edge="end"
                      aria-label="cta"
                    >
                      <ArrowForwardIos />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton component={RouterLink} to={id}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-around"
                      width="100%"
                      maxWidth={300}
                    >
                      <ListItemText
                        primary={`${applicationShortName}-${environmentType}`}
                        secondary={getDateStringFromStatus(
                          status as ProjectStatus,
                          at
                        )}
                      />
                    </Box>
                    {getIconFromStatus(status as ProjectStatus)}
                  </ListItemButton>
                </ListItem>
              </div>
            )
          )}
        </List>
      </Box>
    </Container>
  )
}

export default Projects
