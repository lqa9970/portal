import CustomRadioInput from '@components/form-components/CustomRadioInput'
import CustomTextField from '@components/form-components/CustomTextField'
import { Box, Button, Unstable_Grid2 as Grid, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Project } from '@utils/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { listAvailableEnvironments } from '@api'
import getTerminology from '@utils/getTerminology'
import { createProject } from '@api'
import { Cached } from '@mui/icons-material'
import { queryClient } from '@App'
import { useTranslation } from 'react-i18next'

type Props = {
  project: Project
}

const AddEnvironmentForm = ({ project }: Props) => {
  const { t } = useTranslation()
  const { rowKey } = useParams()
  const { control, handleSubmit } = useForm({
    defaultValues: { environmentType: '', costCenter: project.costCenter },
  })

  const navigate = useNavigate()

  const { data: environmentOptions = [] } = useQuery(
    ['listAvailableEnvironments', project.applicationShortName],
    () => listAvailableEnvironments(project.rowKey),
    {
      select: (data) =>
        data.map((item) => ({ label: getTerminology(item), value: item })),
      staleTime: 0,
    }
  )

  const { mutate, isLoading: isCreatingProject } = useMutation(createProject, {
    onSuccess(data) {
      queryClient.invalidateQueries(['getProjects'])
      localStorage.setItem('projectStatusModalOpen', 'true')
      navigate(`/projects/${data.rowKey}`)
    },
  })

  if (environmentOptions.length === 0) {
    return (
      <>
        <Box minHeight={70}>
          <Typography variant="h5">{project.applicationName}</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="h6">{t('all.environments.created')}</Typography>
        </Box>
      </>
    )
  }

  return (
    <form
      onSubmit={handleSubmit((data) =>
        mutate({
          actionType: 'add-env',
          applicationType: project.applicationType,
          operatingSystem: project.operatingSystem as string,
          environmentType: data.environmentType,
          shouldCreateSubscription: project.shouldCreateSubscription,
          applicationShortName: project.applicationShortName,
          applicationDetail: project.applicationDetail,
          organizationUnit: project.organizationUnit,
          applicationAdministrator: project.applicationAdministrator,
          costCenter: data.costCenter,
          cmdbApplicationName: project.cmdbApplicationName as string,
          cmdbApplicationId: project.cmdbApplicationId as string,
          isPrivacyData: project.isPrivacyData,
          dataClassification: project.dataClassification,
          infrastructureVendor: project.infrastructureVendor as string,
        })
      )}
    >
      <Grid container rowSpacing={2} columnSpacing={12}>
        <Grid xs={12} sm={6}>
          <Box minHeight={70}>
            <Typography variant="h5">{project.applicationName}</Typography>
          </Box>
        </Grid>
        <Grid xs={12}>
          <CustomRadioInput
            control={control}
            name="environmentType"
            label={t('environment.type')}
            description={t('environment.type.description')}
            options={environmentOptions}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <CustomTextField
            control={control}
            name="costCenter"
            defaultValue=""
            label={t('cost.center')}
            helperText={t('cost.center.helper')}
            description={t('cost.center.description')}
          />
        </Grid>
        <Grid xs={12} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{ mr: 4 }}
            type="submit"
            endIcon={isCreatingProject ? <Cached /> : null}
          >
            {t('create.environment')}
          </Button>
          <Button component={RouterLink} to={`/projects/${rowKey}`}>
            {t('cancel')}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddEnvironmentForm
