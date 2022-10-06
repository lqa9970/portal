import {
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Controller, FieldValues } from 'react-hook-form'
import { CustomTextFieldProps } from '@utils/types'
import { Info } from '@mui/icons-material'

const CustomTextField = <T extends FieldValues>({
  label,
  description,
  // required,
  name,
  control,
  defaultValue,
  options,
  ...textFieldProps
}: CustomTextFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field }) => (
      <>
        <Typography variant="body1">
          {label}
          {description && (
            <Tooltip title={description}>
              <IconButton>
                <Info color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </Typography>
        {/* <Typography variant="subtitle2">
          {required ? 'Required' : 'Optional'}
        </Typography> */}
        <TextField
          fullWidth
          margin="dense"
          sx={{ mb: '1rem' }}
          {...textFieldProps}
          {...field}
          inputRef={field.ref}
        >
          {textFieldProps.select &&
            options?.map(({ label, value }) => (
              <MenuItem key={label} value={value}>
                {label}
              </MenuItem>
            ))}
        </TextField>
        {/* <Typography variant="subtitle2">{description}</Typography> */}
      </>
    )}
  />
)

export default CustomTextField
