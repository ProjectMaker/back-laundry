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
  Typography,
  Box,
  Stack
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import {client} from "../App.jsx";
import {getLaundries, removeLaundry} from '../api/index.js'
import HeaderCard, { Card } from "../components/HeaderCard.jsx";
import Header from "../components/HeaderCard.jsx";

const List = () => {
  const navigate = useNavigate()
  const {data, isLoading, error} = useQuery({
    queryKey: ['laundry'],
    queryFn: getLaundries
  })
  const mutationRemove = useMutation({
    mutationFn: async (id) => {
      await removeLaundry(id)

      return id
    },
    onSuccess: (id) => {
      client.setQueryData(['laundry'], (old) => old.filter(p => p.id !== id))
    }
  })
  if (isLoading) {
    return <Header><Typography variant={'h6'}>Chargement</Typography></Header>
  } else if (error) {
    return <Header><Typography variant={'caption'} color={'error'}>{error.message}</Typography></Header>
  }
  return (
    <>
      <HeaderCard>
        <Stack justifyContent={'space-between'} direction={'row'} flex={1}>
          <Typography variant={'h6'}>Les laveries</Typography>
          <IconButton color={'success'} onClick={() => navigate('/laundry')}>
            <AddIcon />
          </IconButton>
        </Stack>
      </HeaderCard>
      <Card sx={{boxShadow: 0}}>
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
                  <TableCell component="th" scope="row" sx={{width: 200}}>
                    <Box>{row.name}</Box>
                  </TableCell>
                  <TableCell align="right">{row.postal_code}</TableCell>
                  <TableCell align="right">{row.city}</TableCell>
                  <TableCell align="right">{Number(row.surface).toLocaleString()} m2</TableCell>
                  <TableCell align="right">{Number(row.price).toLocaleString()} €</TableCell>
                  <TableCell align={"right"}>
                    <IconButton color={'success'} onClick={() => navigate(`/laundry/${row.id}`)}>
                      <EditIcon sx={{fontSize: 18}}/>
                    </IconButton>
                    <IconButton onClick={() => mutationRemove.mutate(row.id)} color={'warning'}>
                      <DeleteIcon sx={{fontSize: 18}} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

export default List
