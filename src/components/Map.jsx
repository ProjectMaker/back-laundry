import { useEffect, useState, useRef } from 'react'
import { Stack, useTheme, List, ListItem, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { createRoot } from 'react-dom/client'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import laundries from '../algolia.json'
import Autocomplete from '../components/Autocomplete'

function MapButton({onClick, children}) {
  const theme = useTheme()
  return (
    <Stack
      onClick={onClick}
      color={'success'}
      size={'small'}
      sx={{
        cursor: 'pointer',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        color: theme.palette.success.main,
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${theme.palette.success.main}`
      }}
    >
      {children}
    </Stack>
  )
}
function ZoomControl({map}) {
  return (
    <Stack gap={2} mr={1} mb={1}>
      <MapButton
        onClick={() => map.setZoom(map.getZoom() + 1)}
      >
        <ZoomInIcon />
      </MapButton>
      <MapButton onClick={() => map.setZoom(map.getZoom() - 1)}>
        <ZoomOutIcon />
      </MapButton>
    </Stack>
  )
}

function createZoomControl(map) {
  const controlButton = document.createElement("div");
  const zoomRoot = createRoot(controlButton)
  zoomRoot.render(<ZoomControl map={map}/>)


  return controlButton;
}

function createFullscreenControl(map) {
  const controlButton = document.createElement("div");
  const zoomRoot = createRoot(controlButton)
  zoomRoot.render(<MapButton
    onClick={() => {
      map.getDiv().firstChild.requestFullscreen()
    }}>
    <FullscreenIcon />
  </MapButton>)


  return controlButton;
}

const initializeControls = (map) => {
  // Create a DIV to attach the control UI to the Map.
  const zoomControlDiv = document.createElement("div");
  const fullscreenControlDiv = document.createElement("div");

// Create the control. This code calls a function that
// creates a new instance of a button control.
  const centerControl = createZoomControl(map);
  const fullscreenControl = createFullscreenControl(map);

// Append the control to the DIV.
  zoomControlDiv.appendChild(centerControl);
  fullscreenControlDiv.appendChild(fullscreenControl);

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear()
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);

  map.controls[google.maps.ControlPosition.RIGHT_TOP].clear()
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(fullscreenControlDiv);
}
const Markers = ({center}) => {
  const map = useMap()
  const [markers, setMarkers] = useState([])
  const clusterer = useRef()

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }

    const bounds = new google.maps.LatLngBounds();
    laundries.forEach(({geometry}) => bounds.extend(geometry))
    map.fitBounds(bounds)
    //map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear()
    initializeControls(map)
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return laundries.map(({address, geometry}, i) => (
    <AdvancedMarker
      key={i}
      position={geometry}
      title={address}
      ref={marker => setMarkerRef(marker, i)}
    >
      <Pin background={'#3B82F6'} glyphColor={'#A5D6A7'} borderColor={'#3B82F6'} />
    </AdvancedMarker>
  ))
}

function LaundriesMap ({index, currentPosition}) {
  const [initialized, setInitialized] = useState(false)
  const autocompleteRef = useRef(null)
  const mapRef = useRef(null)
  const [geoloc, setGeoloc] = useState(null)
  const map = useMap()
  const {data, isLoading, error} = useQuery({
    queryKey: ['geoloc', `${geoloc?.lat}${geoloc?.lng}`],
    queryFn: async () => {
      const { hits } = await index.search('', { aroundLatLng: geoloc ? `${geoloc.lat}, ${geoloc.lng}` : `${currentPosition.lat}, ${currentPosition.lng}`})
      return hits
    },
    enabled: !!geoloc || Boolean(currentPosition)
  })

  useEffect(() => {
    if (!geoloc && data && map) {
      //map.setCenter(data[0]._geoloc)
      //map.setZoom(16)
      //autocompleteRef.current.forceItem(data[0])
    }
  }, [map, geoloc, data]);
  return (
      <>
        <Autocomplete
          ref={autocompleteRef}
          onClick={({_geoloc: {lat, lng}}) => {
            setGeoloc({lat, lng})
            map.setCenter({lat, lng})
            map.setZoom(16)
          }}
        />
        <Stack sx={{width: '100%', height: 400}}>
          <Map
            onTilesLoaded={() => {
              console.log('ini', initialized)
              if (!initialized) {
                map.setCenter(currentPosition)
                map.setZoom(16)
                setInitialized(true)
              }
            }}
            mapId={'3c572553938cd25'}
            zoomControl={false}
            scaleControl={false}
            mapTypeControl={false}
            streetViewControl={false}
            rotateControl={false}
            fullscreenControl={false}
          >
            <Markers center={currentPosition} />
          </Map>
        </Stack>
        <List>
          {
            isLoading && <ListItem><Typography fontSize={14} variant={'caption'}>Chargement ...</Typography></ListItem>
          }
          {
            data?.map(item =>
              <ListItem
                onClick={() => {
                  setGeoloc(item._geoloc)
                  map.setCenter(item._geoloc)
                  map.setZoom(16)
                  autocompleteRef.current.forceValue(item)
                }}
                key={item.address}>
                <Typography variant={'caption'}>{item.address}</Typography>
              </ListItem>
            )
          }
        </List>
      </>
  )
}

export default function Provider ({index}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const r = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        setCurrentPosition({lat: r.coords.latitude, lng: r.coords.longitude})
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
            : currentPosition ? <LaundriesMap index={index} currentPosition={currentPosition}/> : null
      }
    </APIProvider>
  )
}
