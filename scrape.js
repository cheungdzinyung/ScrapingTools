const puppeteer = require("puppeteer");

let scrape = async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "../../Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(
    "http://www.amcham.org.hk/membership/membership-directory/companies/a?page=1"
  );

  const result = await page.evaluate(() => {
    let data = [];
    let elements = document.querySelectorAll(".letter-company-listing");

    function checkExist(data) {
      if (data == undefined) {
        return "";
      } else {
        return data.innerText.trim().replace(/\n/g, ", ");;
      }
    }

    for (let element of elements) {
      // Loop through each company
      let name = element.querySelector(".md-company-title"); //Select name of companies
      let address = element.querySelector("div.icon-address"); //Select address of companies
      let phone = element.querySelector("div.icon-phone"); //Select phone of companies
      let fax = element.querySelector("div.icon-fax"); //Select fax of companies
      let website = element.querySelector("div.icon-website"); //Select website of companies
      let email = element.querySelector("div.icon-email"); //Select email of companies
      data.push({
        companyName: checkExist(name),
        companyAddress: checkExist(address),
        companyPhone: checkExist(phone),
        companyFax: checkExist(fax),
        companyWebsite: checkExist(website),
        companyEmail: checkExist(email)
      });
    }
    return data; // Return our data array
  });
  browser.close();
  return result; // Return the data
};

scrape().then(value => {
  console.log(value); // Success!
});
