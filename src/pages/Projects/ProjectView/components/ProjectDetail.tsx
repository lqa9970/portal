import {} from '@mui/icons-material'
import { Box, Button, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import getTerminology from '@utils/getTerminology'
import { Project } from '@utils/types'
import usePersistedState from '@utils/usePersistedState'
import ProjectStatus from './ProjectStatus'
import { addDays, differenceInDays } from 'date-fns'

type Props = {
  project: Project
}

const ProjectDetail = ({ project }: Props) => {
  const isSandbox = project?.environmentType === 'sandbox'
  const [projectStatusModalOpen, setProjectStatusModalOpen] = usePersistedState(
    'projectStatusModalOpen',
    false
  )
  return (
    <Box mb={16} overflow="hidden">
      <Grid container rowSpacing={6} columnSpacing={12}>
        <Grid xs={12} sm={6}>
          <Box minHeight={70}>
            <Typography variant="h5">{project.applicationName}</Typography>
            <Typography color="text.secondary" variant="subtitle2">
              {getTerminology(project.environmentType)}
              {isSandbox &&
                project.status === 'Completed' &&
                `. ${differenceInDays(
                  addDays(new Date(project.timestamp), 30),
                  new Date()
                )} days left.`}
            </Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            onClick={() => setProjectStatusModalOpen(true)}
            variant="contained"
            sx={{ gap: 2 }}
          >
            Check Status
          </Button>
        </Grid>
        <Grid xs={12}>
          <Typography gutterBottom variant="h6">
            Application type
          </Typography>
          <Typography variant="body1">
            {getTerminology(project.applicationType)}
          </Typography>
        </Grid>
        {!isSandbox && (
          <Grid xs={12}>
            <Typography gutterBottom variant="h6">
              Application Operating system
            </Typography>
            <Typography variant="body1">
              {getTerminology(project.operatingSystem)}
            </Typography>
          </Grid>
        )}

        {!isSandbox && (
          <>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                Environment type
              </Typography>
              <Typography variant="body1">
                {getTerminology(project.environmentType)}
              </Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                Subscription
              </Typography>
              <Typography variant="body1">
                {getTerminology(project.shouldCreateSubscription)}
              </Typography>
            </Grid>
          </>
        )}

        <Grid xs={12}>
          <Typography gutterBottom variant="h6">
            Application short name
          </Typography>
          <Typography variant="body1">
            {project.applicationShortName}
          </Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            Application detail
          </Typography>
          <Typography variant="body1">{project.applicationDetail}</Typography>
        </Grid>
        <Grid xs={12} sm={6}></Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            Organisation unit or Business domain
          </Typography>
          <Typography variant="body1"> {project.organizationUnit} </Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            Project administrator
          </Typography>
          <Typography sx={{ wordBreak: 'break-word' }} variant="body1">
            {project.projectAdministrator}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography gutterBottom variant="h6">
            Cost center
          </Typography>
          <Typography variant="body1">{project.costCenter}</Typography>
        </Grid>

        {!isSandbox && (
          <>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                Efecte (CMDB) Application name
              </Typography>
              <Typography variant="body1">
                {project.cmdbApplicationName}
              </Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                Efecte (CMDB) Application ID
              </Typography>
              <Typography variant="body1">
                {project.cmdbApplicationId}
              </Typography>
            </Grid>
          </>
        )}

        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            Privacy data
          </Typography>
          <Typography variant="body1">
            {getTerminology(project.isPrivacyData)}
          </Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            Data Classification
          </Typography>
          <Typography variant="body1">
            {getTerminology(project.dataClassification)}
          </Typography>
        </Grid>
        {!isSandbox && (
          <Grid xs={12} sm={6}>
            <Typography gutterBottom variant="h6">
              Infrastructure business partner
            </Typography>
            <Typography variant="body1">
              {getTerminology(project.supportPartner)}
            </Typography>
          </Grid>
        )}

        <Grid xs={12} sx={{ mt: 4 }}>
          {!isSandbox && (
            <Button
              component={RouterLink}
              to={`/projects/${project.rowKey}/add-environment`}
              variant="contained"
              color="primary"
              sx={{ mr: 4, mt: 2 }}
            >
              Add environment to project
            </Button>
          )}
        </Grid>
      </Grid>
      <ProjectStatus
        open={projectStatusModalOpen}
        handleClose={() => setProjectStatusModalOpen(false)}
      />
    </Box>
  )
}

export default ProjectDetail
