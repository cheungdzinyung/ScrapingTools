const puppeteer = require("puppeteer");
const fs = require("fs");

const delay = ms => new Promise(_ => setTimeout(_, ms));

let scrape = async () => {
  const browser = await puppeteer.launch({
    // use the following path only for bash
    // executablePath: "../../Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.topuniversities.com/university-rankings/world-university-rankings/2019", {
      timeout: 60 * 1000,
      waitUntil: "networkidle2"
    }
  );
  await page.click("#qs-rankings_length > label > span.jcf-select.jcf-unselectable")
  await delay(1 * 1000);

  await page.click("#qs-rankings_length > label > span.jcf-select.jcf-unselectable.jcf-drop-active > div > div > span > span > ul > li:last-child > span");

  await delay(10 * 1000);

  const result_of_one_page = await page.evaluate(() => {

    const data = Array.from(document.querySelector("#qs-rankings").querySelectorAll("tbody>tr")).map(e => {
      return {
        rank: e.querySelector("span.rank").innerText,
        title: e.querySelector("a.title").innerText,
        more: e.querySelector("a.more").href,
        country: e.querySelector("td.country").innerText,
      };
    })

    return data
  });

  browser.close();
  return result_of_one_page; // Return the data
};

scrape().then(value => {
  fs.writeFileSync('../output/qs-result.json', JSON.stringify(value)); // Success!
});