import { v4 as uuidv4 } from 'uuid';
import { supabase } from './index'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

const PERCENTAGE_COM = .09


export async function addPressingPictures({pressingId, files}) {
  const promises =  files.map(async file => {
    const [extension] = file.name.split('.').slice(-1)
    const fileName = `${uuidv4()}.${extension}`
    const storageResult = await supabase
      .storage
      .from('images')
      .upload(`pressings/${pressingId}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      })
    if (storageResult.error) {
      throw new Error(storageResult.error.message)
    }

    const pictureResult = await supabase.from('pressing_pictures')
      .upsert({pressing_id: pressingId, name: fileName})
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

export async function removePressingPictures(pressingId, pictures) {
  await supabase
    .storage
    .from('images')
    .remove(pictures.map(({name}) => `pressings/${pressingId}/${name}`))
  return supabase
    .from('pressing_pictures')
    .delete()
    .in('id', pictures.map(({uuid}) => uuid))
}

export async function removePressing(id) {
  const picturesRecords = await supabase
    .from('pressing_pictures')
    .select()
    .eq('pressing_id', id)
  if (picturesRecords.error) {
    throw new Error(picturesRecords.error.message)
  } else if (picturesRecords.data.length) {
    await removePressingPictures(id, picturesRecords.data.map(picture => (({...picture, uuid: picture.id}))))
  }
  await supabase
    .from('pressings')
    .delete()
    .eq('id', id)
}

export async function upsertPressing(values) {
  const {data, error} = await supabase
    .from('pressings')
    .upsert({
      ...values,
      updated_at: new Date()
    })
    .select()
  if (error) {
    throw new Error(error.message)
  }
  return data[0]
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

export async function getPressing(id) {
  const records = await supabase
    .from('pressings')
    .select()
    .eq('id', id)
  if (records.error) {
    throw new Error(records.error.message)
  }
  const picturesRecords = await supabase.from('pressing_pictures').select().eq('pressing_id', id)
  if (picturesRecords.error) {
    throw new Error(picturesRecords.error.message)
  }

  const pictures = await Promise.all(
    picturesRecords.data.map(async picture => {
      const {data} = await supabase
        .storage
        .from('images')
        .createSignedUrl(`pressings/${id}/${picture.name}`, 24 * 60 * 60)
      return {
        id: picture.id,
        uuid: picture.id,
        name: picture.name,
        data_url: data.signedUrl
      }
    })
  )
  return {
    ...records.data[0],
    pictures
  }
}

export async function getPressings() {
  const records = await supabase
    .from('pressings')
    .select()
    .order('created_at', {ascending: false})
  if (!records.error) {
    return records.data || []
  } else {
    return []
  }
}
