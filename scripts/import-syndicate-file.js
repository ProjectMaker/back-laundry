import env from 'dotenv'
import fs from 'fs'
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
env.config()

async function readFile(file) {
  const content = fs.readFileSync(file, {encoding: 'utf8'})
  const lines = content.split('\r\n')
    .map(line => {
      const [address, i, postal_code, city] = line.split(';')
      if (address.length) {
        return {
          address,
          postal_code,
          city: ''
        }
      }
    })
    .filter(Boolean)
  return lines
}

function merge() {
  const file1 = loadJSON('./import-files/syndicate/file-1.json')
  const file2 = loadJSON('./import-files/syndicate/file-2.json')
  const file3 = loadJSON('./import-files/syndicate/file-3.json')
  const file = file1.concat(file2).concat(file3)
  fs.writeFileSync('./scripts/import-files/syndicate/file.json', JSON.stringify(file, null, 4), 'utf8')
}
async function getGeocode(address) {
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
      let {address, postal_code, city} = lines.pop()
      console.log(address, postal_code, city)
      const geoloc = await getGeocode(`${address},${postal_code},${city}`)
      newLines.push({
        address,
        postal_code,
        city,
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
//process('./scripts/file-1.csv', './scripts/file-1.json').then(() => {})
//console.log(__dirname)
merge()
