import {
  Stack,
  Card as UICard,
  Typography,
  Box,
  TextField as UITextField,
  useTheme
} from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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

const NavButton = ({onClick, active, children}) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        cursor: 'pointer',
        //padding: '0px 8px',
        paddingLeft: 1,
        paddingRight: 1,
        borderRadius: 4,
        color: active ? 'white' : 'primary.main',
        backgroundColor: active ? 'primary.main' : 'white',
        border: `1px solid ${theme.palette.primary.main}`
      }}
      variant={'outline'} onClick={onClick} color={'primary'}
    >
      <Typography variant={'caption'} sx={{fontWeight: 700}}>{children}</Typography>
    </Box>
  )
}

const Header = ({children}) => {
  const navigate = useNavigate()
  const {pathname} = useLocation()
  return (
    <Card
      variant={'oulined'}
    >
      <Stack sx={{flex: 1, alignSelf: 'end'}}>
        <Stack sx={{alignItems: 'end', alignSelf: 'end'}} direction={'row'} gap={2}>
          <NavButton
            active={pathname !== '/public'}
            onClick={() => navigate('/laundries')}
            >
            Club laverie
          </NavButton>
          <NavButton
            active={pathname === '/public'}
            onClick={() => navigate('/public')}
          >
            LavMap
          </NavButton>
        </Stack>
        <Stack direction={'row'} flex={1} gap={2} >
          <Logo>
            {pathname === '/public' ? 'LM' : 'CL'}
          </Logo>
          {
            children
          }
        </Stack>
      </Stack>
    </Card>
  )
}
// curl -L -X GET 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=rue poulet,Paris&types=geocode&key=AIzaSyDzV1XFsUjc78MN5MmfV5sjsj8qtHYFiZk'
export default Header
