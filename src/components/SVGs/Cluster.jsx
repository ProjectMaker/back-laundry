import * as React from 'react'
const SvgCluster = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 100 100"
    {...props}
  >
    <circle
      cx={81.373}
      cy={106.493}
      r={50}
      style={{
        fill: props.fill || '#000',
        fillOpacity: props.fillOpacity || '0.9',
        strokeWidth: 0.291956,
      }}
      transform="translate(-31.373 -56.493)"
    />
  </svg>
)
export default SvgCluster
