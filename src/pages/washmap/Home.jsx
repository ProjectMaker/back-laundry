import { useEffect, useState, useRef, createRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {Box, Stack, List, ListItem, Typography, Button} from '@mui/material'
import {useDebounce} from "use-debounce";
import {APIProvider } from '@vis.gl/react-google-maps';
import Autocomplete from '../../components/Autocomplete'
import { useLaundries } from '../../api/washmap'
import StreetMap from '../../components/StreetMap'
import AddIcon from "@mui/icons-material/Add.js";



const LaundriesMap = ({initialPosition}) => {
  const autocompleteRef = useRef(null)
  const mapRef = createRef(null)
  const navigate = useNavigate()
  const [_geoloc, setGeoloc] = useState(initialPosition)
  const [geoloc] = useDebounce(_geoloc, 750)
  const {data, isLoading, error} = useLaundries(geoloc || initialPosition)

  return (
    <Stack gap={1}>
      <Stack justifyContent={'space-between'} alignItems='center' direction={'row'} flex={1}>
        <Autocomplete
          ref={autocompleteRef}
          onClick={({latitude, longitude}) => {
            setGeoloc({latitude, longitude})
            console.log(mapRef)
            mapRef.current.panTo({latitude, longitude})
          }}
        />
        <Box ml={1}>
          <Button
            startIcon={<AddIcon />}
            size={'small'}
            onClick={() => navigate('/laundry')} color={'success'} variant={'contained'}
          >
            Ajouter
          </Button>
        </Box>
      </Stack>
      <Stack sx={{width: '100%', height: 400}}>
        <StreetMap
          ref={mapRef}
          onMarkerClick={(item) => navigate(`/washmap/${item.objectID}`)}
          initialRegion={initialPosition}
          onRegionChange={region => setGeoloc(region)}
          markers={data}
        />
      </Stack>
      <List>
        {
          isLoading && <ListItem><Typography variant={'caption'}>Chargement ...</Typography></ListItem>
        }
        {
          data?.map(item =>
            <ListItem
              onClick={() => {
                navigate(`/washmap/${item.objectID}`)
              }}
              key={item.objectID}>
              <Typography variant={'caption'}>{item.address}</Typography>
            </ListItem>
          )
        }
      </List>
    </Stack>
  )
}

export default function Provider () {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const r = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        setCurrentPosition(r.coords)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }

    })()
  }, [])
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY} onLoad={() => console.log('Maps API has loaded.')}>
      {
        loading && !currentPosition
          ? <Typography variant={'caption'}>Chargement ...</Typography>
          : error
            ? <Typography variant={'caption'} color={'error'}>{error}</Typography>
            : currentPosition ? <LaundriesMap initialPosition={currentPosition}/> : null
      }

      <Outlet />
    </APIProvider>
  )
}
