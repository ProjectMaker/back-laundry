import React, { useEffect, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Box, Typography } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader'

import useGoogleClusterMap from './use-cluster-map'
import PinBuilding from './SVGs/PinBuilding'

const styles = [
  {
    'featureType': 'poi',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'visibility': 'on'
      }
    ]
  },
  {
    'featureType': 'transit',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  }
]

const buildBuildingIcon = (google, markerColor) => {
  const staticElement = renderToStaticMarkup(<PinBuilding fill={markerColor} />)
  const svg = window.btoa(staticElement)

  return {
    url: `data:image/svg+xml;base64,${svg}`,
    scaledSize: new google.maps.Size(26, 34),
  }
}

const Cartography = ({
  google,
  map,
  cluster,
  markers
}) => {
  const markersRef = useRef([])
  console.log(markers[0])
  // TODO: Replace type when defined by @center/wimap
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    cluster.markers = []
    markersRef.current.forEach(marker => marker.setMap(null))

    markersRef.current = markers.map(({address, ...position }) => {
      const marker = new google.maps.Marker({
        ...position,
        title: address
      })
      marker.setMap(map)
      return marker
    })
    cluster.addMarkers(markersRef.current)
    if (markersRef.current.length === 1) {
      map.setZoom(18);
      map.setCenter(markersRef.current[0]?.position);
    } else if (markersRef.current.length) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(({ position }) => bounds.extend(position));
      map.fitBounds(bounds);
    } else {
      map.setCenter(
        new google.maps.LatLng(48.873259,48.873259)
      )
      map.setZoom(5);
    }
  }, [markers])
  return null
};

const LoaderMap = ({
  google,
  mapOptions = {
   center: { lat: 48.873259, lng: 2.305976 },
   zoom: 5,
   mapTypeId: 'roadmap',
   disableDefaultUI: true,
   styles,
  },
  algorithmOption = {
   minPoints: 5,
  },
  markers
}) => {
  const infoWindow = useRef(null)
  // TODO: Replace type when defined by @center/wimap
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maps = useGoogleClusterMap({
    google,
    mapOptions,
    algorithmOption,
    infoWindow,
  });
  return (
    <Box sx={{position: 'relative'}}>
      <Box id="mapViewGlobal" sx={{
        borderTopRightRadius: '12px',
        borderBottomRightRadius: '12px',
        width: 600,
        height: 400
      }}
      />
      {
        maps.ready
          && <Cartography infoWindow={infoWindow} google={google} map={maps.map} cluster={maps.cluster} markers={markers} />
      }
    </Box>
  )
};
const LoaderGoogle = (props) => {
  const [google, setGoogle] = useState(null);
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY
    if (google === null && apiKey) {
      (async () => {
        const loader = new Loader({
          // eslint-disable-next-line no-undef
          apiKey,
          libraries: ['geometry'],
          version: 'weekly',
        });
        loader.load().then((google) => setGoogle(google));
      })();
    }
  }, [google]);
  if (!google) {
    return null
  }
  return (
    <>
      <LoaderMap google={google} {...props} />
      <Box position="absolute" display="flex" bottom="30px" left="30px">

      </Box>
    </>
  )
}



export default LoaderGoogle
