import { useMutation } from "@tanstack/react-query";

import {
  client,
  upsertMaterial,
  removeMaterialPictures,
  addMaterialPictures
} from '../../api'

export const DEFAULT_MATERIAL = {
  name: '',
  brand: '',
  availability_date: null,
  model: '',
  status: 'available',
  year: 2024,
  price: 0,
  quantity: 0,
  total_price: 0,
  com: 0,
  sales_price: 0,
  infos: '',
  pictures: []
}


const useSave = () => {
  const saveMaterial = async (newMaterial) => {
    return upsertMaterial(newMaterial)
  }

  const savePictures = async (materialId, pictures) => {
    const picturesToRemove = pictures.filter(({uuid, _deleted}) => uuid && _deleted)
    if (picturesToRemove.length) {
      await removeMaterialPictures(materialId, picturesToRemove)
    }
    const picturesToAdd = pictures.filter(({uuid, _deleted}) => !uuid && !_deleted)
    const newPictures = await addMaterialPictures({materialId, files: picturesToAdd.map(({file}) => file)})
    return pictures.filter(({uuid, _deleted}) => !_deleted && uuid).concat(newPictures)
  }

  const {isPending, error, mutateAsync} = useMutation({
    mutationFn: async ({pictures, ...values}) => {
      const newMaterial = await saveMaterial(values)
      const newPictures = await savePictures(newMaterial.id, pictures)
      return {
        ...newMaterial,
        pictures: newPictures
      }
    },
    onSuccess: (data) => {
      client.setQueryData(['material', data.id], (old) => {
        if (old) {
          return data
        }
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
