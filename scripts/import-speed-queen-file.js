import env from 'dotenv'
import fs from 'fs'
import loadJSON from "./utils.js";
env.config()

async function readFile() {
  return loadJSON('./import-files/speed-queen/source-1.json')
}

export async function getGeocode(address) {
  const url = `https://api.opencagedata.com/geocode/v1/json?key=${'9ba526ebe43f4f2997c2b1037204f1ad'}&q=${address}&no_annotations=1&pretty=1`
  const response = await fetch(url)
  const {results} = await response.json()
  if (results.length) {
    return results[0]
  }
}

async function process() {
  let lines  = await readFile()
  //let lines = [_lines[0]]
  let newLines = []
  try {
    while (lines.length) {
      let address = lines.pop()
      console.log(address)
      const geoloc = await getGeocode(address)
      newLines.push({
        address,
        comments: [],
        geoloc
      })
    }
  } catch (e) {
    console.log(e)
  }
  await fs.writeFileSync('./scripts/import-files/speed-queen/file-1.json', JSON.stringify(newLines, null, 4), 'utf8')
}
//const ADDRESS = '56 rue Rieussec, 78220 Viroflay'
//getGeocode(ADDRESS).then(() => {})
//process('./scripts/import-files/laverie-info/file-1.csv', './scripts/file-1.json').then(() => {})
//console.log(__dirname)
process().then(() => console.log('end'))
