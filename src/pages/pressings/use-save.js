import { object, string, number, array } from 'yup'
import { useMutation } from "@tanstack/react-query";

import { client } from '../../api'
import {upsertPressing, removePressingPictures, addPressingPictures} from '../../api/pressing.js'

export const DEFAULT_PRESSING = {
  name: '',
  postal_code: '',
  city: '',
  status: 'available',
  description: '',
  materials: [],
  pictures: []
}

export const buildSchema = () => {
  return object({
    name: string()
      .required('Requis'),
    postal_code: string().required('Requis'),
    city: string().required('Requis'),
    description: string().required('Requis'),
    surface: number().required('Requis'),
    price: number().required('Requis'),
    rent: number().required('Requis'),
    materials: array().of(
      object({
        name: string()
          .required('Requis'),
      })
    )
  })
}


const useSave = () => {
  const savePressing = async (newLaundry) => {
    return upsertPressing(newLaundry)
  }

  const savePictures = async (pressingId, pictures) => {
    const picturesToRemove = pictures.filter(({uuid, _deleted}) => uuid && _deleted)
    if (picturesToRemove.length) {
      await removePressingPictures(pressingId, picturesToRemove)
    }
    const picturesToAdd = pictures.filter(({uuid, _deleted}) => !uuid && !_deleted)
    const newPictures = await addPressingPictures({pressingId, files: picturesToAdd.map(({file}) => file)})
    return pictures.filter(({uuid, _deleted}) => !_deleted && uuid).concat(newPictures)
  }

  const {isPending, error, mutateAsync} = useMutation({
    mutationFn: async ({pictures, ...values}) => {
      const newLaundry = await savePressing(values)
      const newPictures = await savePictures(newLaundry.id, pictures)
      return {
        ...newLaundry,
        pictures: newPictures
      }
    },
    onSuccess: (data) => {
      client.setQueryData(['pressing', data.id], (old) => {
        if (old) return data
      })
    }
  })

  const handleSave = async ({pictures, ...values}) => {
   return mutateAsync({pictures, ...values})
  }

  return {
    save: handleSave,
    loading: isPending,
    error: error
  }
}

export default useSave
