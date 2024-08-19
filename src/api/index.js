import { createClient } from '@supabase/supabase-js'
import {QueryClient} from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

const PERCENTAGE_COM = .09

export const calculatePrices = ({price, quantity}) => {
  const totalPrice = Number.parseInt(price * quantity)
  const com = Number.parseFloat(totalPrice * PERCENTAGE_COM)
  const salesPrice = totalPrice  + com

  return {
    total_price: totalPrice,
    com: com.toFixed(2),
    sales_price: salesPrice.toFixed(2)
  }
}

const deserializeMaterial = (material) => {
  return {
    id: material.id,
    name: material.name,
    status: material.status,
    brand: material.brand,
    availability_date: material.availability_date,
    infos: material.infos,
    model: material.model,
    year: material.year,
    price: material.price,
    quantity: material.quantity,
    ...calculatePrices({price: material.price, quantity: material.quantity})
  }
}

const serializeMaterial = (material) => {
  return {
    id: material.id,
    name: material.name,
    brand: material.brand,
    status: material.status,
    availability_date: material.availability_date,
    infos: material.infos,
    model: material.model,
    year: material.year,
    price: material.price,
    quantity: material.quantity
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export const client = new QueryClient()

export async function signUp({email, password}) {
  return supabase.auth.signInWithPassword({email, password})
}

export async function addMaterialPictures({materialId, files}) {
  const promises =  files.map(async file => {
    const [extension] = file.name.split('.').slice(-1)
    const fileName = `${uuidv4()}.${extension}`
    const storageResult = await supabase
      .storage
      .from('images')
      .upload(`materials/${materialId}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      })
    if (storageResult.error) {
      throw new Error(storageResult.error.message)
    }

    const pictureResult = await supabase.from('material_pictures')
      .upsert({material_id: materialId, name: fileName})
      .select()
    if (pictureResult.error) {
      throw new Error(pictureResult.error.message)
    }
    return {
      ...pictureResult.data[0],
      uuid: pictureResult.data[0].id
    }
  })

  return Promise.all(promises)
}

export async function removeMaterialPictures(materialId, pictures) {
  await supabase
    .storage
    .from('images')
    .remove(pictures.map(({name}) => `materials/${materialId}/${name}`))
  return supabase
    .from('material_pictures')
    .delete()
    .in('id', pictures.map(({uuid}) => uuid))
}

export async function addLaundryPictures({laundryId, dataURLs}) {
  const records = await Promise.all(
    dataURLs.map(async dataURL =>
      await supabase.from('laundry_picture')
        .upsert({laundry_id: laundryId, data_url: dataURL})
        .select()
    )
  )
  return records.map(({data}) => data[0])
}

export async function removeLaundryPictures(ids) {
  return supabase
    .from('laundry_picture')
    .delete()
    .in('id', [ids])
}


export async function removeLaundry(id) {
  await supabase
    .from('laundry')
    .delete()
    .eq('id', id)
}

export async function removeMaterial(id) {
  const picturesRecords = await supabase
    .from('material_pictures')
    .select()
    .eq('material_id', id)
  if (picturesRecords.error) {
    throw new Error(picturesRecords.error.message)
  } else if (picturesRecords.data.length) {
    await removeMaterialPictures(id, picturesRecords.data.map(picture => (({...picture, uuid: picture.id}))))
  }
  await supabase
    .from('materials')
    .delete()
    .eq('id', id)
}

export async function upsertLaundry(values) {
  const {data, error} = await supabase
    .from('laundry')
    .upsert(values)
    .select()
  if (error) {
    throw new Error(error.message)
  }
  return data[0]
}

export async function upsertMaterial(values) {
  const {data, error} = await supabase
    .from('materials')
    .upsert(serializeMaterial(values))
    .select()
  if (error) {
    throw new Error(error.message)
  }
  return deserializeMaterial(data[0])
}

export async function getLaundry(id) {
  const records = await supabase
    .from('laundry')
    .select()
    .eq('id', id)
  if (records.error) {
    throw new Error(records.error.message)
  }
  const picturesRecords = await supabase.from('laundry_picture').select().eq('laundry_id', id)
  if (picturesRecords.error) {
    throw new Error(picturesRecords.error.message)
  }
  return {
    ...records.data[0],
    pictures: picturesRecords.data.map(({id, ...picture}) => ({uuid: id, ...picture}))
  }

}
export async function getMaterial(id) {
  const records = await supabase
    .from('materials')
    .select()
    .eq('id', id)
  if (records.error) {
    throw new Error(records.error.message)
  }
  const picturesRecords = await supabase.from('material_pictures').select().eq('material_id', id)
  if (picturesRecords.error) {
    throw new Error(picturesRecords.error.message)
  }

  const pictures = await Promise.all(
    picturesRecords.data.map(async picture => {
      const {data} = await supabase
        .storage
        .from('images')
        .createSignedUrl(`materials/${id}/${picture.name}`, 24 * 60 * 60)
      return {
        id: picture.id,
        uuid: picture.id,
        name: picture.name,
        data_url: data.signedUrl
      }
    })
  )
  return {
    ...deserializeMaterial(records.data[0]),
    pictures
  }
}

export async function getLaundries() {
  const records = await supabase
    .from('laundry')
    .select()
    .order('created_at', {ascending: false})
  if (!records.error) {
    return records.data || []
  } else {
    return []
  }
}


export async function getMaterials() {
  const records = await supabase
    .from('materials')
    .select()
    .order('created_at', {ascending: false})
  if (!records.error) {
    return (records.data || []).map(deserializeMaterial)
  } else {
    return []
  }
}


export async  function searchLocations (map, placesLib, verbatim) {
  const response = await fetch(`https://api.tomtom.com/search/2/geocode/${verbatim}.json?key=${import.meta.env.VITE_TOMTOM_KEY}`)
  const {results} = await response.json()
  /*
  const placesService = new placesLib.PlacesService(map)
  const result = await new Promise((resolve) => {
    placesService.textSearch(request, (result) => {
      resolve(result)
    })
  })

   */
  return results.map(({address: {freeformAddress: address}, position: {lon: lng, lat}}) => ({latitude: lat, longitude: lng, address}))
}
