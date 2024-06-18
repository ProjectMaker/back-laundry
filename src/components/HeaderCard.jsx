import {
  Stack,
  Card as UICard,
  TextField as UITextField
} from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'


const Logo = () => {
  return (
    <Stack
      sx={{
        borderRadius: 16,
        width: 32,
        height: 32,
        backgroundColor: '#A5D6A7',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      CL
    </Stack>
  )
}

export const Card = ({children, ...props}) => <UICard variant={'outlined'} {...props}>{children}</UICard>
export const TextField = ({name, ...props}) => {
  const {formState, control} = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({field}) => (
        <UITextField
          variant={'outlined'}
          size={'small'}
          error={!!formState.errors[`${name}`]}
          helperText={formState.errors[`${name}`]?.message}
          fullWidth
          {...props}
          {...field}
        />
      )}
    />

  )
}

const Header = ({children}) => {
  return (
    <Card
      variant={'oulined'}
      sx={{alignItems: 'center'}}
    >
      <Logo />
      {
        children
      }
    </Card>
  )
}

export default Header
