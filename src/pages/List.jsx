import {useMutation, useQuery} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete.js";

import {client} from "../App.jsx";
import {getLaundries, removeLaundry} from '../api/index.js'

const List = () => {
  const navigate = useNavigate()
  const {data, isLoading, error} = useQuery({
    queryKey: ['laundry'],
    queryFn: getLaundries
  })
  const mutationRemove = useMutation({
    mutationFn: async (id) => {
      console.log('iiiiiii')
      await removeLaundry(id)

      return id
    },
    onSuccess: (id) => {
      client.setQueryData(['laundry'], (old) => old.filter(p => p.id !== id))
    }
  })
  if (isLoading) {
    return <Typography variant={'Chargement'} />
  } else if (error) {
    return <Typography variant={"caption"} color={'error'}>{error.message}</Typography>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell align="right">Département</TableCell>
            <TableCell align="right">Ville</TableCell>
            <TableCell align="right">Surface</TableCell>
            <TableCell align="right">Prix</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.postal_code}</TableCell>
              <TableCell align="right">{row.city}</TableCell>
              <TableCell align="right">{Number(row.surface).toLocaleString()} m2</TableCell>
              <TableCell align="right">{Number(row.price).toLocaleString()} €</TableCell>
              <TableCell align={"right"}>
                <IconButton color={'success'} onClick={() => navigate(`/laundry/${row.id}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => mutationRemove.mutate(row.id)} color={'warning'}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default List
