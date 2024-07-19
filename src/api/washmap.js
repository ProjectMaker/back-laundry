import {useQuery, useMutation} from '@tanstack/react-query'

import {supabase, client as queryClient} from './index.js'

const deserializeLaundry = ({lat, long, id, address, machines, ...criteria}) => {
  const [street, city] = address.split(',')
  return {
    address,
    id,
    coordinate: {
      latitude: lat,
      longitude: long,
    },
    street,
    city,
    machines: (machines || []).map(weight => ({weight})),
    criteria
  }
}

export const useReverseGeocoding = () => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['geocoding'],
    queryFn: async () => {
      const {coords: {latitude, longitude}} = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      const url = `https://api.opencagedata.com/geocode/v1/json?key=${import.meta.env.VITE_OPEN_CAGE_DATA_KEY}&q=${latitude},${longitude}&no_annotations=1&pretty=1`
      const response = await fetch(url)
      const {results} = await response.json()
      if (results.length) {
        return {
          address: results[0].formatted,
          latitude,
          longitude
        }
      }
      return {
        latitude,
        longitude
      }
    }
  })

  return {
    isLoading,
    error,
    data
  }
}

export const useLaundries = ({latitude, longitude}) => {
  const {data, isLoading, error} = useQuery({
    queryKey: ['laundries', latitude.toFixed(2), longitude.toFixed(2)],
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

export const useRemoveLaundry = ({id, latitude, longitude}) => {
  const {isPending, error, mutateAsync} = useMutation({
    mutationFn: async () => {
      const {error, data} = await supabase
        .from('public_laundries')
        .delete()
        .eq('id', id)
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: (data, old) => {
      queryClient.setQueryData( ['laundries', latitude, longitude], (old) => {
        return old.filter(laundry => laundry.id !== id)
      })
    }
  })

  return {
    remove: mutateAsync,
    loading: isPending,
    error
  }
}
export const useSaveLaundry = ({latitude, longitude}) => {
  const {isPending, error, mutateAsync} = useMutation({
    mutationFn: async ({id, address, coordinate, machines, criteria}) => {
      let currentId = id
      if (id) {
        const result = await supabase
          .rpc('update_public_laundry_address', {
            id: parseInt(id),
            address,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude
          })
        if (result.error) {
          throw new Error(result.error.message)
        }
      } else {
        const result = await supabase
          .rpc('add_public_laundry_address', {
            address,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude
          })
        if (result.error) {
          throw new Error(result.error.message)
        }
        currentId = parseInt(result.data)
      }

      const result = await supabase
        .from('public_laundries')
        .update({
          ...criteria,
          machines
        })
        .eq('id', currentId)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return {
        id: currentId,
        address,
        coordinate: {
          latitude: parseFloat(coordinate.latitude),
          longitude: parseFloat(coordinate.longitude),
        },
        machines,
        criteria
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['laundry', data.id], data)
      queryClient.setQueryData(['laundries', data.coordinate.latitude.toFixed(2), data.coordinate.longitude.toFixed(2)], (old) => {
        return old.filter(({id}) => id !== data.id).concat(data)
      })
    }
  })
  return {
    save: mutateAsync,
    loading: isPending,
    error: error
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
    },
    enabled: !!id
  })
  return {
    data,
    isLoading,
    error
  }
}
