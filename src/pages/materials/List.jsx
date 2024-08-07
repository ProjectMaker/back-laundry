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
  Button,
  Box,
  Stack
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';

const LandriesList = () => {
  const navigate = useNavigate()
  const data = []
  return (
    <>
      <Stack justifyContent={'end'} direction={'row'} flex={1}>
        <Button
          startIcon={<AddIcon />}
          size={'small'}
          onClick={() => navigate('/material')} color={'success'} variant={'contained'}
        >
          Ajouter
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Marque</TableCell>
              <TableCell align="right">Modèle</TableCell>
              <TableCell align="right">Année</TableCell>
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

export default LandriesList
