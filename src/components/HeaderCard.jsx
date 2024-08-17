import { useState } from 'react'
import {
  Stack,
  Card as UICard,
  Typography,
  Box,
  Menu,
  MenuItem as UIMenuItem,
  useTheme,
  Breadcrumbs
} from '@mui/material'
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import PersonIcon from '@mui/icons-material/Person';
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

const Logout = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const isXsScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Stack
      direction={'row'}
      gap={1}
      sx={{
        cursor: 'pointer'
      }}
      onClick={async () => {
        setLoading(true)
        await supabase.auth.signOut()
        setLoading(false)
        navigate('/')
      }}
    >
      <Typography
        component={'span'}
        sx={{
          color: 'grey.600',
          ...isXsScreen && {visibility: 'hidden'}
        }}
      >{loading ? 'En cours' : 'Déconnexion'}</Typography>

    </Stack>
  )
}

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <PersonIcon onClick={handleClick} sx={{color: 'white'}}/>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          '& .MuiMenu-paper': {
            backgroundColor: 'primary.light',
            '& li, li:hover': {
              backgroundColor: 'primary.light',
            },
          },
          '& .MuiList-root': {
            padding: 0
          }
        }}
      >
        <UIMenuItem><Logout /></UIMenuItem>
      </Menu>
    </div>
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

export default Header
