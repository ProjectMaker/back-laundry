import {Box, Typography} from "@mui/material";

const ProductStatus = ({status}) => {
  return (
    <Box sx={{borderRadius: 4, right: '10px', top: '10px', backgroundColor: status === 'reserved' ? 'warning.main' : status === 'available' ? 'success.main' : 'error.main'}} p={0} pr={1} pl={1}>
      <Typography variant={'caption'} color={'white'}>
        {
          status === 'reserved' ? 'Réservée' : status === 'available' ? 'Disponible' : 'Vendu'
        }
      </Typography>
    </Box>
  )
}

export default ProductStatus
