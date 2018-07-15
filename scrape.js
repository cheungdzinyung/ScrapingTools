const puppeteer = require("puppeteer");
const fs = require("fs");

let scrape = async () => {
  const browser = await puppeteer.launch({
    // use the following path only for bash
    // executablePath: "../../Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: true
  });
  const page = await browser.newPage();
  async function get_result_of_one_letter(letter_input) {
    async function get_result_from_url(url_input){
      await page.goto(
        url_input,
        { 
          timeout: 60 * 1000,
          waitUntil: "networkidle2" 
        }
      );
    
      const result = await page.evaluate(() => {
        let data = [];
        let elements = document.querySelectorAll(".letter-company-listing");
    
        function get_next_page_url() {
          let node_tmp = document.querySelector("span.next>a")
          if (node_tmp instanceof Element){
            return node_tmp.href
          } else {
            return ""
          }
        } 
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
        let browser_data = {
          data_array: data, // Return our data array
          next_page_url: get_next_page_url()
        }
        return browser_data
      });
      return result;
    }
    let url_queue = [`http://www.amcham.org.hk/membership/membership-directory/companies/${letter_input}?page=1`]
    let result_of_many_pages = []
    let counter = 0;
    while(url_queue.length >= 1){
      counter += 1;
      process.stdout.write("work in progress" + ".".repeat(counter) + "\r");
      let result_of_one_page = await get_result_from_url(url_queue.shift()) // get url_queue[0] and remove it from queue
      let next_page_url = result_of_one_page.next_page_url;
      let data_array = result_of_one_page.data_array
      // console.log(result_of_one_page);
      result_of_many_pages = result_of_many_pages.concat(data_array)
      
      if (next_page_url !== "") {
        url_queue.push(next_page_url)
      }else{
        // this is last page
      }
    }
    return result_of_many_pages
  }

  let result_of_all_letters = []
  for(const one_letter of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']) {
    const result_of_one_letter = await get_result_of_one_letter(one_letter)
    result_of_all_letters = result_of_all_letters.concat(result_of_one_letter)
  }
  browser.close();
  return result_of_all_letters; // Return the data
};

scrape().then(value => {
  fs.writeFileSync('./result.json', JSON.stringify(value)); // Success!
});
