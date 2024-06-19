import {
  Stack,
  Card as UICard,
  Typography,
  Box,
  TextField as UITextField
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useFormContext, Controller } from 'react-hook-form'


const Logo = ({children = 'CL'}) => {
  return (
    <Stack
      sx={{
        borderRadius: 18,
        width: 36,
        height: 36,
        backgroundColor: '#5051F3',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {children}
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
  console.log(useLocation())
  const {pathname} = useLocation()
  return (
    <Card
      variant={'oulined'}
    >
      <Stack width={'100%'}>
        <Box sx={{textAlign: 'right'}}>
          {
            pathname === '/public'
              ? (
                <Link to={'/laundries'}>
                  <Typography variant={'caption'}>Club privé</Typography>
                </Link>
              ) : (
                <Link to={'/public'}>
                  <Typography variant={'caption'}>Wash map</Typography>
                </Link>
              )

          }
        </Box>
        <Stack direction={'row'} flex={1} gap={2} justifyContent={'space-between'}>
          <Logo>
            {pathname === '/public' ? 'WM' : 'CL'}
          </Logo>
          {
            children
          }
        </Stack>
      </Stack>
    </Card>
  )
}

export default Header
