import CustomRadioInput from '@components/form-components/CustomRadioInput'
import CustomTextField from '@components/form-components/CustomTextField'
import { Box, Button, Unstable_Grid2 as Grid, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Project } from '@utils/types'

type Props = {
  project: Project
}

const AddEnvironmentForm = ({ project }: Props) => {
  const { projectId } = useParams()
  const { control, handleSubmit } = useForm({
    defaultValues: { environmentType: '', costCenter: project.costCenter },
  })
  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data)
      })}
    >
      <Grid container rowSpacing={2} columnSpacing={12}>
        <Grid xs={12} sm={6}>
          <Box minHeight={70}>
            <Typography variant="h5">
              application name: new environment
            </Typography>
          </Box>
        </Grid>
        <Grid xs={12}>
          <CustomRadioInput
            control={control}
            name="environmentType"
            label="Environment type"
            description="Are the resources deployed for this request going to be used for development, testing (QA) or production purposes? A request for a new cloud project can be submitted for each environment separately."
            options={[
              {
                label: 'Dev',
                value: 'dev',
              },
              {
                label: 'Test',
                value: 'test',
              },
              {
                label: 'QA',
                value: 'qa',
              },
              {
                label: 'Prod',
                value: 'prod',
              },
            ]}
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
          <Button variant="contained" sx={{ mr: 4 }}>
            Create environment
          </Button>
          <Button component={RouterLink} to={`/projects/${projectId}`}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddEnvironmentForm
