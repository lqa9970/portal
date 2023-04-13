import { Box, Button, Typography, Unstable_Grid2 as Grid } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import getTerminology from '@utils/getTerminology'
import { Project } from '@utils/types'
import usePersistedState from '@utils/usePersistedState'
import ProjectStatus from './ProjectStatus'
import { addDays, differenceInDays } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import calculateCost from '@api/projects/calculateCost'

type Props = {
  project: Project
}
type Params = {
  rowKey: string
}

const ProjectDetail = ({ project }: Props) => {
  // const reachedLimit = false       limit check
  const { t } = useTranslation()
  const isSandbox = project?.environmentType === 'sandbox'
  const [projectStatusModalOpen, setProjectStatusModalOpen] = usePersistedState(
    'projectStatusModalOpen',
    false
  )
  const { rowKey } = useParams() as Params

  const { data } = useQuery(['calculateCost', rowKey], () =>
    calculateCost(rowKey)
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
                )} ${t('days.left')}.`}
            </Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            onClick={() => setProjectStatusModalOpen(true)}
            variant="contained"
            sx={{ mb: 2 }}
          >
            {t('check.status')}
          </Button>
        </Grid>
        <Grid xs={12}>
          <Typography gutterBottom variant="h6">
            {t('application.type')}
          </Typography>
          <Typography variant="body1">
            {getTerminology(project.applicationType)}
          </Typography>
        </Grid>
        {!isSandbox && (
          <Grid xs={12}>
            <Typography gutterBottom variant="h6">
              {t('application.operating.system')}
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
                {t('environment.type')}
              </Typography>
              <Typography variant="body1">
                {getTerminology(project.environmentType)}
              </Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                {t('create.dedicated.environment')}
              </Typography>
              <Typography variant="body1">
                {getTerminology(project.shouldCreateSubscription)}
              </Typography>
            </Grid>
          </>
        )}

        <Grid xs={12}>
          <Typography gutterBottom variant="h6">
            {t('application.short.name')}
          </Typography>
          <Typography variant="body1">
            {project.applicationShortName}
          </Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            {t('application.detail')}
          </Typography>
          <Typography variant="body1">{project.applicationDetail}</Typography>
        </Grid>
        <Grid xs={12} sm={6}></Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            {t('organisation.unit')}
          </Typography>
          <Typography variant="body1"> {project.organizationUnit} </Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            {t('application.administrator')}
          </Typography>
          <Typography sx={{ wordBreak: 'break-word' }} variant="body1">
            {project.applicationAdministrator}
          </Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            {t('cost.center')}
          </Typography>
          <Typography variant="body1">{project.costCenter}</Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            {t('project.total.cost')}
          </Typography>
          <Typography variant="body1">{data}</Typography>
        </Grid>

        {!isSandbox && (
          <>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                {t('cmdb.system.name')}
              </Typography>
              <Typography variant="body1">{project.cmdbSystemName}</Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                {t('cmdb.system.id')}
              </Typography>
              <Typography variant="body1">{project.cmdbSystemId}</Typography>
            </Grid>
          </>
        )}

        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            {t('privacy.data')}
          </Typography>
          <Typography variant="body1">
            {getTerminology(project.isPrivacyData)}
          </Typography>
        </Grid>
        <Grid xs={12} sm={6}>
          <Typography gutterBottom variant="h6">
            {t('data.classification')}
          </Typography>
          <Typography variant="body1">
            {getTerminology(project.dataClassification)}
          </Typography>
        </Grid>
        {!isSandbox ? (
          <>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                {t('infrastructure.vendor')}
              </Typography>
              <Typography variant="body1">
                {getTerminology(project.infrastructureVendor)}
              </Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography gutterBottom variant="h6">
                {t('application.vendor')}
              </Typography>
              <Typography variant="body1">
                {getTerminology(project.applicationVendor)}
              </Typography>
            </Grid>
          </>
        ) : null}

        <Grid xs={12} sx={{ mt: 4 }}>
          {!isSandbox && (
            <>
              {/* {reachedLimit ? ( */}
              <Button
                component={RouterLink}
                to={`/projects/${project.rowKey}/add-environment`}
                variant="contained"
                color="primary"
                sx={{ mr: 4, mt: 2 }}
              >
                {t('add.environment.to.project')}
              </Button>
              {/* ) : (
                <Button
                  disabled
                  component={RouterLink}
                  to="#"
                  variant="contained"
                  sx={{ mr: 4, mt: 2 }}
                >
                  {t('maxed.out.env')}
                </Button>
              )} */}
            </>
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
