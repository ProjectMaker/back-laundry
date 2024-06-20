import React from 'react'
import { PinBuilding } from './SVGs/PinBuilding'

export const buildBuildingIcon = (google, markerColor) => {
  const staticElement = renderToStaticMarkup(<PinBuilding fill={markerColor} />)
  const svg = window.btoa(staticElement)

  return {
    url: `data:image/svg+xml;base64,${svg}`,
    scaledSize: new google.maps.Size(26, 34),
  }
}


const useMarker = ({ google, color, onClick, popupContent, iconType }) => {
  const create = (marker) => {
    return new google.maps.Marker({
      ...marker,
      icon: buildBuildingIcon(google, 'green')
    })
  }


  const add = (newMarker) => {
    const marker = create(newMarker)

    return marker
  }

  return add
}

export default useMarker
