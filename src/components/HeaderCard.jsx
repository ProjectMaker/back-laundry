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


const Logo = ({children = 'CL'}) => {
  const theme = useTheme()
  return (
    <Stack
      sx={{
        borderRadius: 18,
        width: 36,
        height: 36,
        backgroundColor: theme.palette.primary.main,
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
            <Link to={'/laundries'}>
              <Typography variant={'h6'}>
                Club laverie
              </Typography>
            </Link>
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Stack sx={{alignItems: 'end'}} direction={'row'} gap={2}>
        <NavButton
          active={pathname.indexOf('/laundries') === -1}
          onClick={() => navigate('/laundries')}
          >
          Laveries
        </NavButton>
        <NavButton
          active={pathname.indexOf('/laundries') === 0}
          onClick={() => navigate('/materials')}
        >
          Matériel
        </NavButton>
      </Stack>

    </Stack>
  )
}
// curl -L -X GET 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=rue poulet,Paris&types=geocode&key=AIzaSyDzV1XFsUjc78MN5MmfV5sjsj8qtHYFiZk'
export default Header
