import { useState } from 'react'
import {
  Stack,
  Typography,
  Menu,
  MenuItem as UIMenuItem,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../api'



const Logout = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
          color: 'grey.600'
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
      <PersonIcon onClick={handleClick} sx={{color: 'primary.main', cursor: 'pointer'}}/>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{

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


export default Profile
