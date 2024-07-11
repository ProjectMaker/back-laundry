import {Modal, Card, Typography, Stack} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import Map from '../../components/StreetMap'
import { useLaundry } from '../../api/washmap'
import StreetMap from "../../components/StreetMap";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
};

const Detail = ({}) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const {data, isLoading} = useLaundry({id})
  console.log(data)
  return (
    <Modal
      open

      onClose={() => navigate('/washmap')}
    >
      <Card sx={style}>
        {(isLoading || !data) && <Typography variant={'caption'}>Chargement ...</Typography>}
        {
          Boolean(data) && (
            <Stack sx={{width: '100%', height: 400}}>
              <StreetMap
                onRegionChange={() => {}}
                initialRegion={data.coordinate}
                markers={[data]}
              />
            </Stack>
          )
        }
      </Card>
    </Modal>

  )
}

export default Detail
