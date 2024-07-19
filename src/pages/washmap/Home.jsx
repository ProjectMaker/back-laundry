import { useEffect, useState, useRef, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {Modal, Card, Stack, List, ListItem, Typography, Button, IconButton, Box} from '@mui/material'
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useDebounce} from "use-debounce";
import {APIProvider } from '@vis.gl/react-google-maps';


import Autocomplete from '../../components/Autocomplete'
import { useLaundries, useRemoveLaundry, useReverseGeocoding } from '../../api/washmap'
import { useCurrentCoordinate } from '../../api/store'
import StreetMap from '../../components/StreetMap'

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

const Remove = ({item, coordinate, onClose}) => {
  const {loading, error, remove} = useRemoveLaundry({id: item.id, ...coordinate})
  return (
    <Modal
      open
      onClose={onClose}
    >
      <Card sx={style}>
        <Stack gap={3} flex={1}>
          {
            !!error && <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
          }
          <Typography variant={'subtitle2'}>
            Vous êtes sur le point de supprimer la laverie
          </Typography>
          <Stack direction={'row'} flex={1} justifyContent={'space-between'}>
            <Button
              color={'warning'}
              variant={'contained'}
              size={'small'}
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              color={'error'}
              variant={'contained'}
              size={'small'}
              onClick={async () => {
                await remove()
                onClose()
              }}
              startIcon={<DeleteIcon />}
            >
              {loading ? 'En cours ...' : 'Supprimer'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Modal>
  )
}
const Laundry = ({item, geoloc, onRemove}) => {
  const navigate = useNavigate()
  return (
    <ListItem>
      <Stack flex={1} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant={'caption'}>{item.address}</Typography>
        <Stack direction={'row'} gap={1}>
          <IconButton color={'success'} onClick={() => navigate(`/washmap/${item.id}`, {state: {coordinate: geoloc}})}>
            <EditIcon sx={{fontSize: 18}}/>
          </IconButton>
          <IconButton color={'error'} onClick={onRemove}>
            <DeleteIcon sx={{fontSize: 18}} />
          </IconButton>
        </Stack>
      </Stack>
    </ListItem>
  )
}

const LaundriesMap = ({}) => {
  const autocompleteRef = useRef(null)
  const [currentCoordinate, setCurrentCoordinate] = useCurrentCoordinate()
  const [lastAddress, setLastAddress] = useState()
  const mapRef = useRef(null)
  const navigate = useNavigate()
  const [itemToRemove, setItemToRemove] = useState(null)
  const [_geoloc, setGeoloc] = useState(currentCoordinate)
  const [geoloc] = useDebounce(_geoloc, 750)
  const {data, isLoading, error} = useLaundries(geoloc || currentCoordinate)

  return (
    <Stack gap={1}>
      {
        Boolean(itemToRemove) && <Remove item={itemToRemove} coordinate={geoloc} onClose={() => setItemToRemove(null)} />
      }
      <Stack alignItems={'end'}>
        <Button
          startIcon={<AddIcon />}
          size={'small'}
          onClick={() => navigate('/washmap/new')} color={'success'} variant={'contained'}
        >
          Ajouter une laverie
        </Button>
      </Stack>
      <Stack sx={{width: '100%', height: 400}}>
        <StreetMap
          ref={mapRef}
          onMarkerClick={(item) => navigate(`/washmap/${item.id}`)}
          initialRegion={currentCoordinate}
          onRegionChange={({latitude, longitude}) => {
            setGeoloc({latitude, longitude})
          }}
          markers={data}
        />
      </Stack>
      <Autocomplete
        ref={autocompleteRef}
        defaultValue={currentCoordinate}
        onClick={({latitude, longitude, address}) => {
          setCurrentCoordinate({latitude, longitude, address})
          mapRef.current.panTo({latitude, longitude})
        }}
      />
      <List>
        {
          isLoading && <ListItem><Typography variant={'caption'}>Chargement ...</Typography></ListItem>
        }
        {
          data?.map(item => <Laundry geoloc={geoloc} key={item.id} item={item} onRemove={() => setItemToRemove(item)} />)
        }
      </List>
    </Stack>
  )
}

export default function Provider () {
  const [currentCoordinate, setCurrentCoordinate] = useCurrentCoordinate(null)
  const {data, isLoading, error} = useReverseGeocoding()
  useEffect(() => {
    if (data) {
      setCurrentCoordinate(data)
    }
  }, [data]);
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY} onLoad={() => console.log('Maps API has loaded.')}>
      {
        isLoading && !currentCoordinate
          ? <Typography variant={'caption'}>Chargement ...</Typography>
          : error
            ? <Typography variant={'caption'} color={'error'}>{error}</Typography>
            : currentCoordinate.latitude ? <LaundriesMap /> : null
      }
    </APIProvider>
  )
}
