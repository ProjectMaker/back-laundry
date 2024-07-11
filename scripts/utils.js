import fs from 'fs'

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

export default loadJSON

