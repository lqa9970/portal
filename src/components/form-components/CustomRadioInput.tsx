import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { Controller, FieldValues } from 'react-hook-form'
import { CustomRadioInputProps } from '@utils/types'
import { Info } from '@mui/icons-material'

const CustomRadioInput = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  label,
  description,
  options,
}: CustomRadioInputProps<T>) => {
  return (
    <FormControl component="fieldset">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
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

            <RadioGroup
              row
              value={value}
              onChange={(_e, v) => {
                // self cast boolean string to boolean
                if (v === 'true') {
                  onChange(true)
                  return
                }
                if (v === 'false') {
                  onChange(false)
                  return
                }
                onChange(v)
              }}
            >
              {options.map(({ value, label, disabled }) => (
                <FormControlLabel
                  key={label}
                  value={value}
                  label={label}
                  disabled={disabled}
                  control={<Radio />}
                />
              ))}
            </RadioGroup>
            {error && (
              <FormHelperText
                sx={{ fontSize: '0.9rem' }}
                error={Boolean(error)}
              >
                {error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  )
}
export default CustomRadioInput
