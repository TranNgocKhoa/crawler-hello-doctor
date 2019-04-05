// External dependencies
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')

const url = 'https://vicare.vn/danh-sach/ho-chi-minh/'
const outputFile = 'data-diachi.json'
const parsedResults = []
const pageLimit = 100
let pageCounter = 0
let resultCount = 0

console.log(chalk.yellow.bgBlue(`\n  Scraping of ${chalk.underline.bold(url)} initiated...\n`))

const getWebsiteContent = async (url) => {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    // New Lists
    $('.content').children('ul').children('li').map((i, element) => {
      const count = resultCount++
      var diaChi = $(element).children(".body").children(".info")
            .children(".brief").children("dd").first().text().trim().replace(/.*\s\(cách.*\n/, '').replace(/.*\skm\)/, '').trim();
      console.log(diaChi);
      var listing = {
        "diaChi": diaChi
      }
      parsedResults.push(listing)
    })


    const nextPageLink = 'https://vicare.vn/danh-sach/ho-chi-minh/' +  $('.pagination').find('.step-links').children().last('a').attr('href')
    console.log(chalk.cyan(`  Scraping: ${nextPageLink}`))
    pageCounter++

    if (pageCounter === pageLimit) {
      exportResults(parsedResults)
      return false
    }

    getWebsiteContent(nextPageLink)
  } catch (error) {
    exportResults(parsedResults)
    console.error(error)
  }
}

const exportResults = (parsedResults) => {
  fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
    if (err) {
      console.log(err)
    }
    console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
  })
}

getWebsiteContent(url)
