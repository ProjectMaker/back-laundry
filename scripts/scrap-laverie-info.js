import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'

const baseURL = 'https://laverieinfo.com';



async function getCityUrls() {

  try {

    const { data } = await axios.get(baseURL);
    const $ = cheerio.load(data);

    const cityLinks = $("a[href^='https://laverieinfo.com/ville']");
    const cityUrls = [];

    cityLinks.each((i, link) => {

      cityUrls.push($(link).attr('href'));

    });
    return cityUrls

  } catch (error) {

    console.error(error);

  }

}



async function scrapeCityLaundromats(cityUrl) {

  try {
    console.log(cityUrl)
    const  result = await fetch(cityUrl);
    const data = await result.text()

    const $ = cheerio.load(data);

    let laundries = [];

    $("div.company").each((i, company) => {
      const address = $(company).find("[itemprop='streetAddress']").text()
      let comments = []
      $(company).find(".comments p").each((i, comment) => {
        if (i>0) {
          comments.push($(comment).text().replace(/[\t\n]/ig, '').trim())
        }
      })
      laundries.push({address, comments})
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

    const addresses = await scrapeCityLaundromats(cityUrl);

    laundries = laundries.concat(addresses)

  }



  fs.writeFileSync('./scripts/import-files/laverie-info/source-1.json', JSON.stringify(laundries, null, 2), 'utf-8');

  console.log(laundries)

}



main();
