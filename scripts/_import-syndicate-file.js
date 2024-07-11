import env from 'dotenv'
import fs from 'fs'
env.config()

async function readFile(file) {
  const content = fs.readFileSync(file, {encoding: 'utf8'})
  const lines = content.split('\r\n')
  return lines
}

export async function getGeocode(address) {
  const url = `https://api.opencagedata.com/geocode/v1/json?key=${'9ba526ebe43f4f2997c2b1037204f1ad'}&q=${address}&no_annotations=1&pretty=1`
  const response = await fetch(url)
  const {results} = await response.json()
  if (results.length) {
    return results[0]
  }
}

async function process(file, target) {
  let lines  = await readFile(file)
  //let lines = [_lines[0]]
  let newLines = []
  try {
    while (lines.length) {
      let line = lines.pop()
      console.log(line)
      const geoloc = await getGeocode(line)
      newLines.push({
        address: line,
        geoloc
      })
    }
  } catch (e) {
    console.log(e)
  }
  await fs.writeFileSync(target, JSON.stringify(newLines, null, 4), 'utf8')
}
//const ADDRESS = '56 rue Rieussec, 78220 Viroflay'
const FILE = './scripts/file-3.csv'
//getGeocode(ADDRESS).then(() => {})
process('./scripts/import-files/laverie-info/file-1.csv', './scripts/file-1.json').then(() => {})
//console.log(__dirname)
