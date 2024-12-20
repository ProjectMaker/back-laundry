import {useMutation, useQuery} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Stack
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {client} from '../../api'
import { getPressings, removePressing} from "../../api/pressing";
import ProductStatus from '../../components/ProductStatus'

const PressingsList = () => {
  const navigate = useNavigate()
  const {data, isLoading, error} = useQuery({
    queryKey: ['pressings'],
    queryFn: getPressings
  })
  const mutationRemove = useMutation({
    mutationFn: async (id) => {
      await removePressing(id)

      return id
    },
    onSuccess: (id) => {
      client.setQueryData(['pressings'], (old) => old.filter(p => p.id !== id))
    }
  })
  if (isLoading) {
    return <Typography variant={'caption'}>Chargement ...</Typography>
  } else if (error) {
    return <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
  }
  return (
    <>
      <Stack justifyContent={'end'} direction={'row'} flex={1}>
        <Button
          startIcon={<AddIcon />}
          size={'small'}
          onClick={() => navigate('/pressing')} color={'success'} variant={'contained'}
        >
          Ajouter
        </Button>
      </Stack>
      <TableContainer component={'div'}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Adresse</TableCell>
              <TableCell align="right">Surface</TableCell>
              <TableCell align="right">Prix</TableCell>
              <TableCell align="right">Statut</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{width: 200}}>
                  <Box>{row.name}</Box>
                </TableCell>
                <TableCell align="right">{row.postal_code} {row.city}</TableCell>
                <TableCell align="right">{Number(row.surface).toLocaleString()} m2</TableCell>
                <TableCell align="right">{Number(row.price).toLocaleString()} €</TableCell>
                <TableCell align="right"><ProductStatus status={row.status} /></TableCell>
                <TableCell align={"right"}>
                  <IconButton color={'success'} onClick={() => navigate(`/pressing/${row.id}`)}>
                    <EditIcon sx={{fontSize: 18}}/>
                  </IconButton>
                  <IconButton color={'success'} onClick={() => window.open(`${import.meta.env.VITE_FRONT_URL}/pressings/${row.id}`, 'blank')}>
                    <VisibilityIcon sx={{fontSize: 18}}/>
                  </IconButton>
                  <IconButton onClick={() => mutationRemove.mutate(row.id)} color={'error'}>
                    <DeleteIcon sx={{fontSize: 18}} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PressingsList
