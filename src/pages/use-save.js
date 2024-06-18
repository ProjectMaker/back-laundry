import { object, string, number, array } from 'yup'
import { useMutation } from "@tanstack/react-query";

import { upsertLaundry, removePictures, addPictures, removeLaundry } from '../api'
import { client } from '../App'
export const DEFAULT_LAUNDRY = {
  name: '',
  postal_code: '',
  city: '',
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

export const buildSignUpSchema = () => {
  return object({
    email: string()
      .required('Requis'),
    password: string().required('Requis')
  })
}
const useSave = () => {
  const saveLaundry = async (newLaundry) => {
    return upsertLaundry(newLaundry)
  }

  const savePictures = async (laundryId, pictures) => {
    const idsToRemove = pictures.filter(({uuid, _deleted}) => uuid && _deleted).map(({uuid}) => uuid)
    await removePictures(idsToRemove)
    const picturesToAdd = pictures.filter(({uuid, _deleted}) => !uuid && !_deleted).map(({data_url}) => data_url)
    const newPictures = await addPictures({laundryId, dataURLs: picturesToAdd})
    return pictures.filter(({uuid, _deleted}) => !_deleted && uuid).concat(newPictures.map(({id, ...picture}) => ({uuid: id, ...picture})))
  }

  const {isPending, error, mutateAsync} = useMutation({
    mutationFn: async ({pictures, ...values}) => {
      const newLaundry = await saveLaundry(values)
      const newPictures = await savePictures(newLaundry.id, pictures)
      return {
        ...newLaundry,
        pictures: newPictures
      }
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
