import {
  Stack,
  Typography,
  Box,
  useTheme,
  Breadcrumbs
} from '@mui/material'
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Profile from './Profile'

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
        color: active ? 'primary.main' : 'white',
        backgroundColor: active ? 'white' : 'primary.main',
        border: `1px solid ${theme.palette.primary.main}`
      }}
      variant={'outline'} onClick={onClick} color={'primary'}
    >
      <Typography variant={'caption'} sx={{fontWeight: 700}}>{children}</Typography>
    </Box>
  )
}

const Header = () => {
  const navigate = useNavigate()
  const {pathname} = useLocation()
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
          active={pathname.indexOf('/laundries') === 0 || pathname.indexOf('/laundry') === 0}
          onClick={() => navigate('/laundries')}
          >
          Laveries
        </NavButton>
        <NavButton
          active={pathname.indexOf('/pressings') === 0 || pathname.indexOf('/pressing') === 0}
          onClick={() => navigate('/pressings')}
        >
          Pressings
        </NavButton>
        <NavButton
          active={pathname.indexOf('/materials') === 0 || pathname.indexOf('/material') === 0}
          onClick={() => navigate('/materials')}
        >
          Matériel
        </NavButton>
        <Profile />
      </Stack>

    </Stack>
  )
}

export default Header
