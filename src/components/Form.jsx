import { useState } from 'react'
import {Controller, useFormContext} from "react-hook-form";
import {
  TextField as UITextField,
  Typography,
  Stack,
  styled,
  Checkbox as UICheckbox,
  Switch as UISwitch,
  MenuItem
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

let hours = []
for (let cpt=0; cpt<24; cpt++) {
  if (cpt < 10) {
    hours.push({label: `0${cpt}`, value: cpt})
  } else {
    hours.push({label: cpt, value: cpt})
  }
}

export const FormLabel = ({variant = 'body2', children, ...props}) => {
  return (
    <Typography variant={variant} {...props}>{children}</Typography>
  )
}

const SwitchBase = styled((props) => (
  <UISwitch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export const FormGroup = ({label, children}) => {
  return (
    <Stack sx={{gap: 1.5}}>
      <FormLabel variant={'subtitle2'}>{label}</FormLabel>
      <Stack sx={{gap: 1}}>
        {children}
      </Stack>
    </Stack>
  )
}

export const DatePicker = ({name, label, onChange = () => {}}) => {
  const {formState, control} = useFormContext()
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange: onFieldChange, ...field}}) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              sx={{width: '100%'}}
              label={label}
              onChange={value => {
                onFieldChange(value)
                onChange(value)
              }}
              {...field}
            />
          </LocalizationProvider>
        )}
      />
      {
        Boolean(formState.errors[`${name}`]?.message) && (
          <Typography variant={'caption'} color={'error'}>{formState.errors[`${name}`]?.message}</Typography>
        )
      }
    </>
  )
}

export const Checkbox = ({name, label}) => {

  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <FormLabel sx={{marginRight: 1}}>{label}</FormLabel>
      <Controller
        name={name}
        render={({field}) => {
          return <UICheckbox
            key={`${name}-${field.value}`}
            checked={field.value}
            onChange={e => {
              const newValue = !field.value
              field.onChange(newValue)
            }}
          />
        }}
      />
    </Stack>
  )
}

export const Switch = ({name, label}) => {
  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <FormLabel sx={{marginRight: 1}}>{label}</FormLabel>
      <Controller
        name={name}
        render={({field}) => {
          return <SwitchBase defaultChecked={field.value} onChange={e => {
            const newValue = !field.value
            field.onChange(newValue)
          }}/>
        }}
      />
    </Stack>
  )
}

export const TextField = ({name, onChange, children, ...props}) => {
  const {formState, control} = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange: onFieldChange, ...field}}) => (
        <UITextField
          variant={'outlined'}
          size={'small'}
          error={!!formState.errors[`${name}`]}
          helperText={formState.errors[`${name}`]?.message}
          fullWidth
          onChange={(e) => {
            onFieldChange(e)
            onChange?.(e)
          }}
          {...props}
          {...field}
        >
          {children}
        </UITextField>
      )}
    />

  )
}

export const HourField = (props) => {
  return (
    <TextField select {...props}>
      {
        hours.map(hour => (
          <MenuItem key={hour.value} value={hour.value}>
            {hour.label}
          </MenuItem>
        ))
      }
    </TextField>
  )
}
