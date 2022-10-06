// @ts-nocheck`
import { Info, Search } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMsal } from '@azure/msal-react'
import CustomRadioInput from '@components/form-components/CustomRadioInput'
import CustomTextField from '@components/form-components/CustomTextField'
import { getProjects, getUsers } from '@api'
import {
  environmentTypeOptions,
  operatingSystemOptions,
  projectApplicationTypeOptions,
  projectDataClassification,
  projectDefaultValues,
  sandboxApplicationTypeOptions,
  sandboxDataClassification,
  sandboxDefaultValues,
  yesNoOptions,
} from './options'
import { ProjectFormData } from '@utils/types'
import { useEffect, useState } from 'react'
import createProject from '@api/projects/createProject'

const CreateForm = () => {
  const { instance } = useMsal()
  const navigate = useNavigate()
  const { type } = useParams()
  const isSandbox = type === 'sandbox'
  const defaultValues = isSandbox ? sandboxDefaultValues : projectDefaultValues
  const { watch, control, handleSubmit, setValue } = useForm<ProjectFormData>({
    defaultValues,
  })
  const watchIsNewProjectNeeded = watch('isNewProjectNeeded')
  const watchExistingProject = watch('existingProject')
  const [userSearchTerm, setUserSearchTerm] = useState('')

  useEffect(() => {
    if (watchIsNewProjectNeeded) {
      setValue('existingProject', null)
    }
  }, [watchIsNewProjectNeeded])

  const { data: userData = [] } = useQuery(['getUsers', userSearchTerm], () =>
    getUsers({ instance, data: userSearchTerm })
  )
  const { data: projectData = [] } = useQuery(['getProjects'], () =>
    getProjects()
  )

  const { mutate } = useMutation(createProject, {
    onSuccess(data) {
      console.log(data)
      localStorage.setItem('projectStatusModalOpen', 'true')
      // mock sandbox and project
      if (isSandbox) {
        navigate('/projects/1')
      } else {
        navigate('/projects/3')
      }
    },
  })

  return (
    <form
      style={{ display: 'flex', justifyContent: 'center' }}
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      <Box mb={16}>
        <Grid container rowSpacing={2} columnSpacing={12}>
          <Grid xs={12}>
            <Controller
              name="applicationType"
              control={control}
              render={() => <div></div>}
            />

            <CustomRadioInput
              control={control}
              name="applicationType"
              label="Application type"
              description="Is application accessible directly from Internet (public) or only internally (private). 
              Internal workloads cannot have public ip's."
              options={
                isSandbox
                  ? sandboxApplicationTypeOptions
                  : projectApplicationTypeOptions
              }
            />
          </Grid>

          {isSandbox && (
            <>
              <Grid xs={12}>
                <CustomRadioInput
                  control={control}
                  name="isNewProjectNeeded"
                  label="Is a new Azure DevOps project needed"
                  description="Is a new Azure DevOps project named after the application needed? Azure DevOps projects can be created also for projects residing at Google Cloud Platform"
                  options={yesNoOptions}
                />
              </Grid>

              {watchIsNewProjectNeeded === false && (
                <>
                  <Grid xs={12} sm={6}>
                    <Controller
                      control={control}
                      name="existingProject"
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          onChange={(_, v, reason) => {
                            if (reason === 'clear') {
                              field.onChange(null)
                            }
                            if (!v) return
                            field.onChange(v)
                            setValue(
                              'applicationShortName',
                              v.applicationShortName
                            )
                            setValue('applicationDetail', v.applicationDetail)
                            setValue('applicationDetail', v.applicationDetail)
                            setValue('operatingSystem', v.operatingSystem)
                            setValue('organizationUnit', v.organizationUnit)
                            setValue(
                              'projectAdministrator',
                              v.projectAdministrator
                            )
                            setValue('costCenter', v.costCenter)
                            setValue('isPrivacyData', v.isPrivacyData)
                          }}
                          fullWidth
                          getOptionLabel={(option) =>
                            option
                              ? `${option.applicationShortName}-${option.environmentType}`
                              : ''
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          options={projectData.filter(
                            (project) => project.environmentType === 'sandbox'
                          )}
                          renderInput={(params) => {
                            return (
                              <>
                                <Typography variant="body1">
                                  Existing Azure DevOps project used?
                                  <Tooltip title="If project has existing ADO project, requester can select that one to be used.">
                                    <IconButton>
                                      <Info color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                </Typography>
                                <TextField
                                  margin="dense"
                                  sx={{ mb: '1rem' }}
                                  {...params}
                                />
                              </>
                            )
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={6}> </Grid>
                </>
              )}
            </>
          )}

          {!isSandbox && (
            <>
              <Grid xs={12} sm={6}>
                <CustomTextField
                  control={control}
                  disabled={!!watchExistingProject}
                  name="operatingSystem"
                  label="Application Operating system"
                  description="Operating system version of Software"
                  select
                  options={operatingSystemOptions}
                />
              </Grid>
              <Grid xs={12} sm={6}></Grid>
            </>
          )}

          {!isSandbox && (
            <>
              <Grid xs={12} sm={6}>
                <CustomRadioInput
                  control={control}
                  name="environmentType"
                  label="Environment type"
                  description="Are the resources deployed for this request going to be used for development, testing (QA) or production purposes? A request for a new cloud project can be submitted for each environment separately."
                  options={environmentTypeOptions}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <CustomRadioInput
                  control={control}
                  name="shouldCreateSubscription"
                  label="Create dedicated environment"
                  options={yesNoOptions}
                />
              </Grid>
            </>
          )}

          <Grid xs={12} sm={6}>
            <CustomTextField
              control={control}
              name="applicationShortName"
              disabled={!!watchExistingProject}
              label="Application short name"
              helperText="No blanks, only letters. Max 4 characters"
              description="Short name for the application system this project is to deploy. Most important data entry on the form with the most impact. This is used in the naming convention creating resources. You can use the name that is/ will be used when referring to the project in spoken language. Preferably one word written in English alphabets, without spacing or special characters."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid xs={12} sm={6}></Grid>

          <Grid xs={12} sm={6}>
            <CustomTextField
              control={control}
              name="applicationDetail"
              disabled={!!watchExistingProject}
              multiline
              rows={4}
              label="Application detail"
              description="Short description for the application. For small applications it may be the same as ApplicationName."
            />
          </Grid>
          <Grid xs={12} sm={6}></Grid>

          <Grid xs={12} sm={6}>
            <CustomTextField
              control={control}
              disabled={!!watchExistingProject}
              name="organizationUnit"
              label="Organization Unit or Business domain"
              description="Organization or Business unit that owns the workload."
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <Controller
              control={control}
              name="projectAdministrator"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(_, v) => {
                    field.onChange(v)
                  }}
                  fullWidth
                  onInputChange={(_, v) => {
                    setUserSearchTerm(v)
                  }}
                  disabled={!!watchExistingProject}
                  options={userData}
                  // use filterOptions to facilitate server side options
                  filterOptions={(x) => x}
                  renderInput={(params) => {
                    return (
                      <>
                        <Typography variant="body1">
                          Project Administrator
                          <Tooltip title="Person who can authorize access request to project in Orion IAM.">
                            <IconButton>
                              <Info color="primary" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                        <TextField
                          margin="dense"
                          sx={{ mb: '1rem' }}
                          {...params}
                        />
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <CustomTextField
              control={control}
              disabled={!!watchExistingProject}
              name="costCenter"
              helperText="Numbers only"
              label="Cost Center"
              description="Applications WBS Code"
            />
          </Grid>

          <Grid xs={12} sm={6}></Grid>
          {!isSandbox && (
            <>
              <Grid xs={12} sm={6}>
                <CustomTextField
                  control={control}
                  name="cmdbApplicationName"
                  label="Efecte (CMDB) Application name"
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <CustomTextField
                  control={control}
                  name="cmdbApplicationId"
                  helperText="Numbers only"
                  label="Efecte (CMDB) Application ID"
                />
              </Grid>
            </>
          )}

          <Grid xs={12} sm={6}>
            <CustomRadioInput
              control={control}
              name="isPrivacyData"
              label="Privacy data"
              description="Does the project involve processing of personal data? Personal data means any information relating to an identified or identifiable natural person (‘data subject’). An identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, home address, date of birth, picture, voice recording, an identification number (customer number, ID number), location data, an online identifier (email address, IP address), economic data etc."
              options={yesNoOptions.map((option) =>
                watchExistingProject ? { ...option, disabled: true } : option
              )}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <CustomRadioInput
              control={control}
              name="dataClassification"
              label="Data Classification"
              description="Ensure that the information is properly classified according to the Protection and Classification of Orion Information Standard. "
              options={
                isSandbox
                  ? sandboxDataClassification.map((option) =>
                      watchExistingProject
                        ? { ...option, disabled: true }
                        : option
                    )
                  : projectDataClassification
              }
            />
          </Grid>
          {!isSandbox && (
            <Grid xs={12} sm={6}>
              <CustomTextField
                control={control}
                name="supportPartner"
                label="Infrastructure support partner"
              />
            </Grid>
          )}

          <Grid xs={12}>
            <Box mt={4}>
              <Button variant="contained" type="submit">
                Create project
              </Button>
              <Button component={RouterLink} to="/" sx={{ ml: 4 }}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </form>
  )
}

export default CreateForm
