import { useEffect,useState } from 'react'
import {useQuery} from '@tanstack/react-query'

import {supabase} from './index.js'

const deserializeLaundry = ({lat, long, id, address}) => {
  const [street, city] = address.split(',')
  return {
    address,
    objectID: id,
    coordinate: {
      latitude: lat,
      longitude: long,
    },
    street,
    city
  }
}

export const useLaundries = ({latitude, longitude}) => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['laundries', latitude, longitude],
    queryFn: async () => {
      const {data, error} = await supabase
        .rpc('nearby_laundries', {
          min_lat: latitude - .02,
          min_long: longitude - .02,
          max_lat: latitude + .02,
          max_long: longitude + .02
        })

      if (error) {
        throw new Error(error.message)
      }
      return data.map(deserializeLaundry)
    },

  })
  return {
    data: data || [],
    isLoading,
    error
  }
}

export const useLaundry = ({id}) => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['laundry', id],
    queryFn: async () => {
      const {data, error} = await supabase
        .rpc('get_public_laundry', {
          id
        })
      if (error) {
        throw new Error(error.message)
      }
      return deserializeLaundry(data[0])
    }
  })
  return {
    data,
    isLoading,
    error
  }
}
