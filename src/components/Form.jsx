import { useState } from 'react'
import {Controller, useFormContext} from "react-hook-form";
import {TextField as UITextField, Typography, Stack, styled, Switch as UISwitch} from "@mui/material";

export const FormLabel = ({variant = 'body2', children}) => {
  return (
    <Typography variant={variant}>{children}</Typography>
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

export const Switch = ({name, defaultValue, label}) => {
  const {getValues} = useFormContext()
  const [value, setValue] = useState(defaultValue)
  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        render={({field}) => {
          return <SwitchBase checked={getValues(name)} onClick={e => {
            const newValue = !value
            field.onChange(newValue)
            setValue(newValue)
          }}/>
        }}
      />
    </Stack>
  )
}
export const TextField = ({name, onChange, ...props}) => {
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
        />
      )}
    />

  )
}
