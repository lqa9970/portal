import CustomRadioInput from '@components/form-components/CustomRadioInput'
import CustomTextField from '@components/form-components/CustomTextField'
import { Box, Button, Unstable_Grid2 as Grid, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Project } from '@utils/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import listAvailableEnvironments from '@api/projects/listAvailableEnvironments'
import getTerminology from '@utils/getTerminology'
import { createProject } from '@api'
import { Cached } from '@mui/icons-material'
import { queryClient } from '@App'

type Props = {
  project: Project
}

const AddEnvironmentForm = ({ project }: Props) => {
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
    }
  )

  const { mutate, isLoading: isCreatingProject } = useMutation(createProject, {
    onSuccess(data) {
      queryClient.invalidateQueries(['getProjects'])
      localStorage.setItem('projectStatusModalOpen', 'true')
      navigate(`/projects/${data.rowKey}`)
    },
  })

  return (
    <form
      onSubmit={handleSubmit((data) =>
        mutate({
          ...project,
          ...data,
          applicationType: project.applicationType,
          actionType: 'add-env',
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
            label="Environment type"
            description="Are the resources deployed for this request going to be used for development, testing (QA) or production purposes? A request for a new cloud project can be submitted for each environment separately."
            options={environmentOptions}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <CustomTextField
            control={control}
            name="costCenter"
            defaultValue=""
            helperText="Numbers only"
            label="Cost Center"
            description="Applications WBS Code"
          />
        </Grid>
        <Grid xs={12} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{ mr: 4 }}
            type="submit"
            endIcon={isCreatingProject ? <Cached /> : null}
          >
            Create environment
          </Button>
          <Button component={RouterLink} to={`/projects/${rowKey}`}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddEnvironmentForm
