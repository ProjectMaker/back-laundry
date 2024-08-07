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

    let laundromats = [];

    $("div.company [itemprop='streetAddress']").each((i, elem) => {
      console.log('--', $(elem).text())

        laundromats.push($(elem).text())

    });

    return laundromats;

  } catch (error) {

    console.error(error);

  }

}



async function main() {

  const cityUrls = await getCityUrls();
  let allLaundromats = [];



  for (const cityUrl of cityUrls) {

    const cityName = cityUrl.split("/").pop().replace("-", " ").replace("laveries", "").trim();
    //console.log(cityUrls)
    const addresses = await scrapeCityLaundromats(cityUrl);

    allLaundromats = allLaundromats.concat(addresses)

  }



  fs.writeFileSync('./laundromats.json', JSON.stringify(allLaundromats, null, 2), 'utf-8');

  console.log("Laundromat addresses saved to laundromats.json");

}



main();
