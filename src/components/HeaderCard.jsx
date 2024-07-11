import {
  Stack,
  Card as UICard,
  Typography,
  Box,
  TextField as UITextField,
  useTheme,
  Breadcrumbs
} from '@mui/material'
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
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


const NavButton = ({onClick, active, children}) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        cursor: 'pointer',
        padding: .25,
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

const FOLDERS = [{
  path: '/public',
  name: 'Laveries près de chez vous'
}]

const Header = ({children}) => {
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const folder = FOLDERS.find(({path}) => path === pathname)
  return (
    <Stack sx={{flex: 1, justifyContent: 'space-between'}} alignItems={'center'} direction={'row'}>
      <Stack>
        <Stack direction={'row'} flex={1} gap={2} alignItems={'center'} >
          <Logo>
            <LocalLaundryServiceIcon />
          </Logo>
          <Breadcrumbs>
            {
              pathname.indexOf('/washmap') === 0 && (
                <Link to={'/washmap'}>
                  <Typography variant={'h6'}>
                    Washmap
                  </Typography>
                </Link>
              )
            }
            {
              pathname === '/washmap' && (
                <Typography variant={'subtitle2'}>
                  Près de chez vous
                </Typography>
              )
            }
            {
              (pathname.indexOf('/laundries') === 0 || pathname.indexOf('/laundry') === 0 ) && (
                <Link to={'/laundries'}>
                  <Typography variant={'h6'}>
                    Club laverie
                  </Typography>
                </Link>
              )
            }
            {
              pathname.indexOf('/laundry') === 0 && (
                <Typography variant={'subtitle2'}>
                  Edition
                </Typography>
              )
            }
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Stack sx={{alignItems: 'end'}} direction={'row'} gap={2}>
        <NavButton
          active={pathname !== '/washmap'}
          onClick={() => navigate('/laundries')}
          >
          Club laverie
        </NavButton>
        <NavButton
          active={pathname === '/washmap'}
          onClick={() => navigate('/washmap')}
        >
          WashMap
        </NavButton>
      </Stack>

    </Stack>
  )
}
// curl -L -X GET 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=rue poulet,Paris&types=geocode&key=AIzaSyDzV1XFsUjc78MN5MmfV5sjsj8qtHYFiZk'
export default Header
