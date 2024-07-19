import {
  atom,
  useRecoilState
} from 'recoil'

const currentCoordinateState = atom({
  key: 'currentCoordinate',
  default: {
    latitude: null,
    longitude: null
  }
})

const lastAddressState = atom({
  key: 'filters',
  default: {
    name: null,
    longitude: null,
    latitude: null
  }
})

export const useCurrentCoordinate = () => useRecoilState(currentCoordinateState)
export const useLastAddress = () => useRecoilState(lastAddressState)
