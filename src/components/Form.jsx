import {Controller, useFormContext} from "react-hook-form";
import {TextField as UITextField} from "@mui/material";

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
