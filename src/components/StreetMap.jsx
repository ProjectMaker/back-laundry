import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Stack, useTheme } from '@mui/material'
import {Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { createRoot } from 'react-dom/client'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import laundries from '../algolia.json'

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
const Markers = ({items, onMarkerClick}) => {
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

  return items.map((item, i) => (
    <AdvancedMarker
      key={i}
      position={{lat: item.coordinate.latitude, lng: item.coordinate.longitude}}
      title={item.address}
      ref={marker => setMarkerRef(marker, i)}
      onClick={() => onMarkerClick(item)}
    >
      <Pin background={'#3B82F6'} glyphColor={'#A5D6A7'} borderColor={'#3B82F6'} />
    </AdvancedMarker>
  ))
}

const StreetMap = forwardRef(({
  initialRegion,
  onRegionChange,
  markers,
  onMarkerClick
}, ref) => {
  const [initialized, setInitialized] = useState(false)
  const map = useMap()
  useImperativeHandle(ref, () => ({
    panTo: ({latitude, longitude}) => {
      map.setCenter({lat: latitude, lng: longitude})
      map.setZoom(14)
    }
  }))
  useEffect(() => {
    if (map) {
      map.addListener('center_changed', () => {
        onRegionChange({latitude: map.getCenter().lat(), longitude: map.getCenter().lng()})
      })
    }
  }, [map])

  return (
    <Map
      onTilesLoaded={() => {
        if (!initialized) {
          map.setCenter({lat: initialRegion.latitude, lng: initialRegion.longitude})
          map.setZoom(14)
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
      <AdvancedMarker
        position={{lat: initialRegion.latitude, lng: initialRegion.longitude}}
        title={'Vous'}
      />
      <Markers items={markers} onMarkerClick={onMarkerClick} />
    </Map>
  )
})

export default StreetMap

