import { chromium } from "playwright";
import { extractJsonFromHtmlScript } from "./helpers/extractJsonFromHtmlScript";
import { getRandomArbitrary } from "./helpers/getRandomArbitrary";

export const getTravelTime = async (
  narekCoordinates: number[],
  destination: number[]
) => {
    const browser = await chromium.launch({ headless: false, slowMo: getRandomArbitrary(300, 3500) });
    const page = await browser.newPage();
    const url = `https://yandex.com/maps/10262/yerevan/?indoorLevel=1&mode=routes&rtext=${narekCoordinates[0]}%2C${narekCoordinates[1]}~${destination[0]}%2C${destination[1]}`;
    const responsePromise = page.waitForResponse(url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    const response = await responsePromise;
    
    const dataText = await response.text();
    
    const extractedJson = extractJsonFromHtmlScript(dataText);
    const {durationInTraffic} = extractedJson.config.routerResponse.routes[0];

    await browser.close();
    return durationInTraffic;
};

// Below is for debugging purposes only

// const narekCoordinates = [40.181053, 44.515882];
// const destination = [40.177642, 44.512519];

// (async () => {

//     const browser = await chromium.launch({ headless: true, devtools: true, slowMo: 5000 });
//     const page = await browser.newPage();
//     const url = `https://yandex.com/maps/10262/yerevan/?indoorLevel=1&mode=routes&rtext=${narekCoordinates[0]}%2C${narekCoordinates[1]}~${destination[0]}%2C${destination[1]}`;
//     const responsePromise = page.waitForResponse(url);
//     await page.goto(url);
    
//     const response = await responsePromise;    
    
//     const dataText = await response.text();
    
//     const extractedJson = extractJsonFromHtmlScript(dataText);
//     const {durationInTraffic} = extractedJson.config.routerResponse.routes[0];
    
//     await browser.close();
//     return durationInTraffic;
// })();
