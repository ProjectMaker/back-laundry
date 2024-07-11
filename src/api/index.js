import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})


export async function signUp({email, password}) {
  return supabase.auth.signInWithPassword({email, password})
}

export async function addPictures({laundryId, dataURLs}) {
  const records = await Promise.all(
    dataURLs.map(async dataURL =>
      await supabase.from('laundry_picture')
        .upsert({laundry_id: laundryId, data_url: dataURL})
        .select()
    )
  )
  return records.map(({data}) => data[0])
}

export async function removePictures(ids) {
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

export async function getLaundry(id) {
  const records = await supabase
    .from('laundry')
    .select()
    .eq('id', id)
  const picturesRecords = await supabase.from('laundry_picture').select().eq('laundry_id', id)
  if (!records.error && !picturesRecords.error) {
    return {
      ...records.data[0],
      pictures: picturesRecords.data.map(({id, ...picture}) => ({uuid: id, ...picture}))
    }
  } else {
    return []
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



export async  function searchLocations (map, placesLib, verbatim) {
  const request = {
    query: verbatim
  };
  const response = await fetch(`https://api.tomtom.com/search/2/geocode/${verbatim}.json?key=${import.meta.env.VITE_TOMTOM_KEY}`)
  const {results} = await response.json()
  console.log(results)
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
