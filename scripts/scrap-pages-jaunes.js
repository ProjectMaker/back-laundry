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
    console.log(data)
    const $ = cheerio.load(data);

    let laundries = [];
    $("div.bi-content").each((i, company) => {
      const name = $(company).find(".bi-denomination h3").text()
      const [a, b, address] = $(company).find(".bi-address .pj-link").text().split('\n')
      laundries.push({address: address.trim(), name})
    })
    const link = $("div").each((i, item) => {
      console.log('------')
      console.log($(item).text())
      console.log('------')
    })

    return {
      laundries,
      next: link ? link.attr('href') : null
    };

  } catch (error) {

    console.error(error);

  }

}

async function pagination(url) {
  let contents = []
  let _url = url
  while (_url) {
    const {next, laundries} = await scrapAddress(_url)
    console.log(next)
    _url = null
  }
}

async function main() {

  const cityUrls = ['https://www.pagesjaunes.fr/annuaire/paris-75/laverie-automatique']//await getCityUrls();
  let laundries = [];



  for (const cityUrl of cityUrls) {

    //const addresses = await scrapAddress(cityUrl);
  await pagination(cityUrl)
    //laundries = laundries.concat(addresses)

  }


  console.log(laundries.length)
  //fs.writeFileSync('./scripts/import-files/speed-queen/source-1.json', JSON.stringify(laundries, null, 2), 'utf-8');
}



main();
