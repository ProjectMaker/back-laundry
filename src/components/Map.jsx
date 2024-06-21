import { useEffect, useState, useRef } from 'react'
import { Stack, useTheme } from '@mui/material'
import {APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { createRoot } from 'react-dom/client'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import laundries from '../algolia.json'

function ZoomButton({onClick, children}) {
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
      <ZoomButton
        onClick={() => map.setZoom(map.getZoom() + 1)}
      >
        <ZoomInIcon />
      </ZoomButton>
      <ZoomButton onClick={() => map.setZoom(map.getZoom() - 1)}>
        <ZoomOutIcon />
      </ZoomButton>
    </Stack>
  )
}
function createCenterControl(map) {
  const controlButton = document.createElement("div");
  const zoomRoot = createRoot(controlButton)
  zoomRoot.render(<ZoomControl map={map}/>)


  return controlButton;
}

const initializeControls = (map) => {
  // Create a DIV to attach the control UI to the Map.
  const centerControlDiv = document.createElement("div");

// Create the control. This code calls a function that
// creates a new instance of a button control.
  const centerControl = createCenterControl(map);

// Append the control to the DIV.
  centerControlDiv.appendChild(centerControl);

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear()
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

}
const Markers = () => {
  const map = useMap()
  const [markers, setMarkers] = useState([])
  const clusterer = useRef()

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
    map.setZoom(8)
    //map.setCenter(laundries[0].geometry)
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

export default function LaundriesMap () {
  return (
    <Stack sx={{width: '100%', height: 400}}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          mapId={'LAUNDRIES'}
          zoomControl={false}
          scaleControl={false}
          mapTypeControl={false}
          streetViewControl={false}
          rotateControl={false}
          fullscreenControl={false}
        >
          <Markers />
        </Map>
      </APIProvider>
    </Stack>
  )
}

