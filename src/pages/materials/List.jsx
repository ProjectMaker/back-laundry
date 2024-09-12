import { useNavigate } from 'react-router-dom'

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Stack, Typography
} from '@mui/material'


import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useMutation, useQuery} from "@tanstack/react-query";

import {client, getMaterials, removeMaterial} from "../../api/index";
import ProductStatus from '../../components/ProductStatus'
import { MATERIAL_CATEGORY } from '../../constants'

const Item = ({item}) => {
  const navigate = useNavigate()
  const mutationRemove = useMutation({
    mutationFn: async () => {
      await removeMaterial(item.id)
      return item.id
    },
    onSuccess: (id) => {
      client.setQueryData(['materials'], (old) => old.filter(p => p.id !== id))
    }
  })
  return (
    <TableRow
      key={item.id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row" sx={{width: 200}}>
        {
          MATERIAL_CATEGORY.find(({name}) => name === item.category)?.label
        }
      </TableCell>
      <TableCell align="right">{item.brand} {item.model}</TableCell>
      <TableCell align="right">{item.year}</TableCell>
      <TableCell align="right">{Number(item.price).toLocaleString()} €</TableCell>
      <TableCell align="right">{Number(item.quantity).toLocaleString()}</TableCell>

      <TableCell align="right">{Number(item.com).toLocaleString()} €</TableCell>
      <TableCell align="right"><ProductStatus status={item.status} /></TableCell>
      <TableCell align={"right"}>
        <IconButton color={'success'} onClick={() => window.open(`${import.meta.env.VITE_FRONT_URL}/materials/${item.id}`, 'blank')}>
          <VisibilityIcon sx={{fontSize: 18}}/>
        </IconButton>
        <IconButton onClick={() => mutationRemove.mutate(item.id)} color={'error'}>
          <DeleteIcon sx={{fontSize: 18}} />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
const MaterialsList = () => {
  const navigate = useNavigate()
  const {data, isLoading, error} = useQuery({
    queryKey: ['materials'],
    queryFn: getMaterials
  })
  if (isLoading) {
    return <Typography variant={'caption'}>Chargement ...</Typography>
  } else if (error) {
    return <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
  }
  return (
    <TableContainer component={'div'}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell align="right">Marque / Modèle</TableCell>
            <TableCell align="right">Année</TableCell>
            <TableCell align="right">Prix</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Com</TableCell>
            <TableCell align="right">Vendu</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Item
              key={row.id}
              item={row}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MaterialsList
