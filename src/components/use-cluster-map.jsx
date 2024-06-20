import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import { useTheme } from '@mui/material'
import Cluster from './SVGs/Cluster'

const buildClusterIcon = (google, clusterColor) => {
  const staticElement = renderToStaticMarkup(<Cluster fill={clusterColor} fillOpacity={0.8}/>)
  const svg = window.btoa(staticElement)

  return {
    url: `data:image/svg+xml;base64,${svg}`,
    scaledSize: new google.maps.Size(52, 40),
  }
}




const useMaps = ({ google, mapOptions, algorithmOption = {}, infoWindow }) => {
  const [map, setMap] = useState(null)
  const [cluster, setCluster] = useState(null)
  const theme = useTheme()

  const markerClusterProps = {
    algorithm: new SuperClusterAlgorithm(algorithmOption),
    renderer: {
      render: ({ count, position }) => {
        const color = theme.palette.grey.main

        return new google.maps.Marker(
          {
            position,
            icon: buildClusterIcon(google, color),
            label: {
              text: String(count),
              color: 'white',
              fontFamily: 'Poppins',
              fontSize: '12px',
              fontWeight: 'bold',
              lineHeight: 1.2,
            },
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          })
      }
    },
    markers: []
  }

  const initialize = () => {
    /*
    const controls = renderControls({ map, activeEquipment })
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear()
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controls.zoom)
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controls.legend)
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear()
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controls.maptype)
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controls.breadcrumb)
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controls.modal)

     */
  }

  useEffect(() => {
    if (google && !map) {
      const element = document.getElementById('mapViewGlobal')
      const newMap = new google.maps.Map(element, mapOptions)
      const markersCluster = new MarkerClusterer({
        ...markerClusterProps,
        map: newMap
      })
      setCluster(markersCluster)
      setMap(newMap)
    }
  }, [google, map])

  useEffect(() => {
    if (map) {
      initialize()
    }
  }, [map])
  return {
    initialize,
    ready: Boolean(cluster && map),
    cluster,
    infoWindow,
    map
  }
}

export default useMaps
