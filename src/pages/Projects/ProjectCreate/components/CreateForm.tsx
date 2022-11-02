import { Cached, Info } from '@mui/icons-material'
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
import { zodResolver } from '@hookform/resolvers/zod'

import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import CustomRadioInput from '@components/form-components/CustomRadioInput'
import CustomTextField from '@components/form-components/CustomTextField'
import {
  checkApplicationShortNameValid,
  // uncomment to show select existing project
  // getProjects,
  getUsers,
} from '@api'
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
import {
  CreateFormData,
  CreateFormDataSchema,
  EnvironmentType,
} from '@utils/types'
import { useEffect, useState } from 'react'
import { createProject } from '@api'
import useDebounce from '@utils/useDebounce'
import { queryClient } from '@App'
import { useTranslation } from 'react-i18next'
import { useAccount } from '@azure/msal-react'

// uncomment to show select existing project
// type ChangedFields = [
//   'applicationShortName',
//   'applicationDetail',
//   'organizationUnit',
//   'applicationAdministrator',
//   'costCenter',
//   'isPrivacyData'
// ]

const CreateForm = () => {
  const navigate = useNavigate()
  const account = useAccount()
  const { t } = useTranslation()
  const { type } = useParams()
  const isSandbox = type === 'sandbox'
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const userSearchTermDebounce = useDebounce(userSearchTerm, 400)
  const defaultValues = isSandbox ? sandboxDefaultValues : projectDefaultValues
  const {
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateFormData>({
    defaultValues,
    resolver: zodResolver(CreateFormDataSchema),
  })

  const watchApplicationAdministrator = watch('applicationAdministrator')
  const watchIsNewProjectNeeded = watch('isNewProjectNeeded')
  const watchExistingProject = watch('existingProject')
  const watchEnvironmentType = watch('environmentType') as EnvironmentType
  const watchApplicationShortName = watch('applicationShortName')
  const applicationShortNameDebounce = useDebounce(
    watchApplicationShortName,
    400
  )

  // clear existingProject value when isNewProjectNeeded change
  useEffect(() => {
    if (watchIsNewProjectNeeded) {
      setValue('existingProject', null)
    }
  }, [watchIsNewProjectNeeded])

  const { data: userData = [], isLoading: isLoadingUsers } = useQuery(
    ['getUsers', userSearchTermDebounce],
    () => {
      if (!userSearchTermDebounce) return []
      return getUsers({ data: userSearchTermDebounce })
    }
  )
  // this is used to populate user principal, it is different from user email
  useEffect(() => {
    if (account) {
      setUserSearchTerm(account.username)
    }
  }, [account])
  useEffect(() => {
    if (!watchApplicationAdministrator && userData.length === 1) {
      setValue('applicationAdministrator', userData[0])
    }
  }, [userData, watchApplicationAdministrator])

  // uncomment to show select existing project
  // const { data: projectData = [] } = useQuery(['getProjects'], () =>
  //   getProjects()
  // )
  const {
    data: isApplicationShortNameValid,
    isLoading: checkingApplicationShortName,
  } = useQuery(
    [
      'checkApplicationShortNameValid',
      applicationShortNameDebounce,
      watchEnvironmentType,
    ],
    () => {
      if (!applicationShortNameDebounce || !watchEnvironmentType) return true
      return checkApplicationShortNameValid({
        applicationShortName: applicationShortNameDebounce,
        environmentType: watchEnvironmentType,
      })
    },
    {
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

  return (
    <form
      style={{ display: 'flex', justifyContent: 'center' }}
      onSubmit={handleSubmit((data) =>
        mutate({
          ...data,
        })
      )}
    >
      <Box mb={16} overflow="hidden">
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
              label={t('application.type')}
              description={t('application.type.description')}
              options={
                isSandbox
                  ? sandboxApplicationTypeOptions
                  : projectApplicationTypeOptions
              }
            />
          </Grid>

          {/* uncomment this to show select existing project */}
          {/* {isSandbox && (
            <>
              <Grid xs={12}>
                <CustomRadioInput
                  control={control}
                  name="isNewProjectNeeded"
                  label={t('is.new.project.needed')}
                  description={t('is.new.project.needed.description')}
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
                            const changedFields: ChangedFields = [
                              'applicationShortName',
                              'applicationDetail',
                              'organizationUnit',
                              'applicationAdministrator',
                              'costCenter',
                              'isPrivacyData',
                            ]
                            for (const field of changedFields) {
                              setValue(field, v[field])
                            }
                          }}
                          fullWidth
                          getOptionLabel={(option) =>
                            option ? option.applicationName : ''
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.rowKey === value.rowKey
                          }
                          options={projectData.filter(
                            (project) => project.environmentType === 'sandbox'
                          )}
                          renderInput={(params) => {
                            return (
                              <>
                                <Typography variant="body1">
                                  {t('existing.project')}
                                  <Tooltip
                                    title={t('existing.project.description')}
                                  >
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
          )} */}

          {!isSandbox && (
            <>
              <Grid xs={12} sm={6}>
                <CustomTextField
                  control={control}
                  disabled={!!watchExistingProject}
                  name="operatingSystem"
                  label={t('application.operating.system')}
                  description={t('application.operating.system.description')}
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
                  label={t('environment.type')}
                  description={t('environment.type.description')}
                  options={environmentTypeOptions}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <CustomRadioInput
                  control={control}
                  name="shouldCreateSubscription"
                  label={t('create.dedicated.environment')}
                  description={t('create.dedicated.environment.description')}
                  options={yesNoOptions}
                />
              </Grid>
            </>
          )}

          <Grid xs={12} sm={6}>
            <CustomTextField
              control={control}
              name="applicationShortName"
              data-cy="applicationShortName"
              disabled={!!watchExistingProject}
              error={
                !checkingApplicationShortName && !isApplicationShortNameValid
              }
              label={t('application.short.name')}
              helperText={
                !checkingApplicationShortName && !isApplicationShortNameValid
                  ? t('short.name.not.available')
                  : t('application.short.name.helper')
              }
              description={t('application.short.name.description')}
              InputProps={{
                endAdornment: checkingApplicationShortName ? (
                  <InputAdornment position="end">
                    <Cached />
                  </InputAdornment>
                ) : null,
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
              label={t('application.detail')}
              description={t('application.detail.description')}
            />
          </Grid>
          <Grid xs={12} sm={6}></Grid>

          <Grid xs={12} sm={6}>
            <CustomTextField
              control={control}
              disabled={!!watchExistingProject}
              name="organizationUnit"
              label={t('organisation.unit')}
              description={t('organisation.unit.description')}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <Controller
              control={control}
              name="applicationAdministrator"
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
                  loading={isLoadingUsers}
                  disabled={!!watchExistingProject}
                  options={userData}
                  // use filterOptions to facilitate server side options
                  filterOptions={(x) => x}
                  renderInput={(params) => {
                    return (
                      <>
                        <Typography variant="body1">
                          {t('application.administrator')}
                          <Tooltip
                            title={t('application.administrator.description')}
                          >
                            <IconButton>
                              <Info color="primary" />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                        <TextField
                          margin="dense"
                          sx={{ mb: '1rem' }}
                          error={Boolean(errors.applicationAdministrator)}
                          helperText={
                            errors.applicationAdministrator
                              ? errors.applicationAdministrator?.message
                              : ''
                          }
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
              data-cy="costCenter"
              label={t('cost.center')}
              helperText={t('cost.center.helper')}
              description={t('cost.center.description')}
            />
          </Grid>

          <Grid xs={12} sm={6}></Grid>
          {!isSandbox && (
            <>
              <Grid xs={12} sm={6}>
                <CustomTextField
                  control={control}
                  name="cmdbApplicationName"
                  label={t('cmdb.system.name')}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <CustomTextField
                  control={control}
                  name="cmdbApplicationId"
                  label={t('cmdb.system.id')}
                  helperText={t('cmdb.system.id.helper')}
                />
              </Grid>
            </>
          )}

          <Grid xs={12} sm={6}>
            <CustomRadioInput
              control={control}
              name="isPrivacyData"
              label={t('privacy.data')}
              description={t('privacy.data.description')}
              options={yesNoOptions.map((option) =>
                watchExistingProject ? { ...option, disabled: true } : option
              )}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <CustomRadioInput
              control={control}
              name="dataClassification"
              label={t('data.classification')}
              description={t('data.classification.description')}
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
          {!isSandbox ? (
            <>
              <Grid xs={12} sm={6}>
                <CustomTextField
                  control={control}
                  name="applicationVendor"
                  label={t('application.vendor')}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <CustomTextField
                  control={control}
                  name="supportPartner"
                  label={t('infrastructure.vendor')}
                />
              </Grid>
            </>
          ) : null}

          <Grid xs={12}>
            <Box mt={4}>
              <Button
                variant="contained"
                data-cy="submit"
                type="submit"
                endIcon={isCreatingProject ? <Cached /> : null}
              >
                {isSandbox ? t('create.sandbox') : t('create.project')}
              </Button>
              <Button component={RouterLink} to="/" sx={{ ml: 4 }}>
                {t('cancel')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </form>
  )
}

export default CreateForm
