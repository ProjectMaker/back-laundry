import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'

const baseURL = 'https://speedqueeninvestor.com/our-laundry-stores/locations/france/';



async function getCityUrls() {

  try {

    const { data } = await axios.get(baseURL);
    const $ = cheerio.load(data);
    let cityUrls = []
    const cityLinks = $(".ml_directory_index_wrapper_region a");

    $(cityLinks).each((i, item) => {
      const link = $(item).attr('href')
      cityUrls.push(`${baseURL}${link}`)
    })
    return cityUrls

  } catch (error) {

    console.error(error);

  }

}



async function scrapAddress(cityUrl) {

  try {
    console.log(cityUrl)
    const  result = await fetch(cityUrl);
    const data = await result.text()

    const $ = cheerio.load(data);

    let laundries = [];

    $("div.ml_city_level_item address").each((i, company) => {
      const [road, address] = $(company).text().split(',')
      const [, street] = road.split('\n')
      const [city] = road.split('\n').slice(-1)
      const r = `${street.trim()}, ${address.replace(/\n/, '').trim()} ${city.trim()}`
      laundries.push(r)
    })
    return laundries;

  } catch (error) {

    console.error(error);

  }

}



async function main() {

  const cityUrls = await getCityUrls();
  let laundries = [];



  for (const cityUrl of cityUrls) {

    const addresses = await scrapAddress(cityUrl);

    laundries = laundries.concat(addresses)

  }



  fs.writeFileSync('./scripts/import-files/speed-queen/source-1.json', JSON.stringify(laundries, null, 2), 'utf-8');
}



main();
