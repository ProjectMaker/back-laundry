import loadJSON from "./utils.js";
import fs from "fs";

let syndicates = loadJSON('./import-files/syndicate/file.json')
  .filter(laundry => laundry.geoloc)
let laveries = loadJSON('./import-files/laverie-info/file-1.json')
  .filter(laundry => laundry.geoloc)
let items = loadJSON('./import-files/algolia-speed.json')
items = items.map(item => ({address: item.address, comments: item.comments, _geoloc: item.geometry}))
fs.writeFileSync('./scripts/import-files/algolia-speed-1.json', JSON.stringify(items, null, 2), 'utf-8');
//console.log(items.filter(({comments}) => comments.length).length)

let speed = loadJSON('./import-files/speed-queen/file-1.json')
  .filter(laundry => laundry.geoloc)
  .map(laundry => ({
    address: laundry.address,
    geometry: laundry.geoloc.geometry,
    comments: []
  }))
//fs.writeFileSync('./scripts/import-files/algolia-speed.json', JSON.stringify(speed, null, 2), 'utf-8');

const merge = () => {
  /*
  const laundriesToAdd = syndicates
    .filter(({geoloc}) => {
      const laverie = laveries.find(laverie => laverie.geoloc.formatted === geoloc.formatted)
      return !laverie
    })
  const laundries = laundriesToAdd.concat(
    laveries.map(laundry => ({
        ...laundry,
        geoloc: {...laundry.geoloc, formatted: `${laundry.address}, ${laundry.geoloc.components.country}`}
      })
    ))*/
  speed.map(laundry => ({
    address: laundry.geoloc.formatted,
    geometry: laundry.geoloc.geometry,
    comments: laundry.comments || []
  }))
  console.log(laundriesToAdd.length)
  console.log(laundries.length)
  fs.writeFileSync('./scripts/import-files/algolia.json', JSON.stringify(laundries, null, 2), 'utf-8');
}
//console.log(speed)
//merge()
