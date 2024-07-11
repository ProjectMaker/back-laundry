import { useEffect, useState, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Stack, List, ListItem, Typography } from '@mui/material'
import {useDebounce} from "use-debounce";
import {APIProvider } from '@vis.gl/react-google-maps';
import Autocomplete from '../../components/Autocomplete'
import { useLaundries } from '../../api/washmap'
import StreetMap from '../../components/StreetMap'



const LaundriesMap = ({initialPosition}) => {
  const autocompleteRef = useRef(null)
  const mapRef = useRef(null)
  const navigate = useNavigate()
  const [_geoloc, setGeoloc] = useState(initialPosition)
  const [geoloc] = useDebounce(_geoloc, 750)
  const {data, isLoading, error} = useLaundries(geoloc || initialPosition)

  return (
    <Stack gap={1}>
      <Autocomplete
        ref={autocompleteRef}
        onClick={({latitude, longitude}) => {
          setGeoloc({latitude, longitude})
          mapRef.current.panTo({latitude, longitude})
        }}
      />
      <Stack sx={{width: '100%', height: 400}}>
        <StreetMap
          ref={mapRef}
          initialRegion={initialPosition}
          onRegionChange={region => setGeoloc(region)}
          markers={data}
        />
      </Stack>
      <List>
        {
          isLoading && <ListItem><Typography fontSize={14} variant={'caption'}>Chargement ...</Typography></ListItem>
        }
        {
          data?.map(item =>
            <ListItem
              onClick={() => {
                navigate(`/washmap/${item.objectID}`)
              }}
              key={item.address}>
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
