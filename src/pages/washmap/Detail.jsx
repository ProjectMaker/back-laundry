import { Modal, Box } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
};

const Detail = ({onClose}) => {
  return (
    <Modal
      open
      onClose={onClose}>
      <Box sx={style}>
        <h3>Ok</h3>
      </Box>
    </Modal>

  )
}

export default Detail
