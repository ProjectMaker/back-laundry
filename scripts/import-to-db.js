import { createClient } from '@supabase/supabase-js'
import loadJSON from "./utils.js";
const laundries = loadJSON('./import-files/algolia.json')
const supabase = createClient('https://gydzccqlkcmkfacrsbsm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZHpjY3Fsa2Nta2ZhY3JzYnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg3NjQ3MjMsImV4cCI6MjAzNDM0MDcyM30.yBWG6u4eICX3pJK7l3rhnbSlQI9Co7_yYh765LBlztI', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

const add = async ({address, _geoloc}) => {
  console.log(address)
  const r = await supabase
    .rpc('add_public_laundry', {address, lat: _geoloc.lat, long: _geoloc.lng})

  console.log(r)
}

for (let item of laundries.filter(({_geoloc}) => _geoloc.lat > 0 && _geoloc.lng > 0)) {
  await add(item)
}


