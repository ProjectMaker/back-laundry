import * as React from 'react'
const SvgPin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width="1em"
    height="1em"
    viewBox="0 0 44.479 57.358"
    {...props}
  >
    <g fill="#010101">
      <path
        id={props.id}
        d="m46 76.234 1.225-1.271c.857-.892 21.017-17.063 21.017-33.845 0-12.264-9.978-22.242-22.241-22.242-12.262 0-22.412 9.98-22.238 22.242.24 17.004 20.156 32.953 21.014 33.844z"
        style={{
          fill: '#262626',
          fillOpacity: 1,
        }}
        transform="translate(-23.763 -18.876)"
      />
      <path
        d="M57.264 40.626c0-6.208-5.053-11.259-11.262-11.259-6.209 0-11.262 5.051-11.262 11.259 0 6.21 5.053 11.263 11.262 11.263 6.209 0 11.262-5.053 11.262-11.263"
        style={{
          fill: props.fill,
        }}
        transform="translate(-23.763 -18.876)"
      />
    </g>
  </svg>
)
export default SvgPin
