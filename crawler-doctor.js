// External dependencies
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')

const url = 'https://vicare.vn/danh-sach/bac-si/ho-chi-minh/'
const outputFile = 'data.json'
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


      const doctorName = $(element).children(".body").children(".info").children('h2').children("a").text().trim();
      var urlImage;
      if ($(element).children(".media").children("a").attr('style') != ""
        && typeof $(element).children(".media").children("a").attr('style') != 'undefined') {
        urlImage = $(element).children(".media").children("a").attr('style').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
      }
      var chucDanh;
      var chuyenKhoa;
      var mota;
      var donvi;
      $(element).children(".body").children(".info").children(".brief").children("dd").each(
        function (indexC, elementC) {
          if (indexC === 0) { chucDanh = $(elementC).children("a").text(); }

          if (indexC === 1) { chuyenKhoa = $(elementC).children("a").text(); }

          if (indexC === 2) { mota = $(elementC).children("a").text(); }
          if (indexC === 3) { donVi = $(elementC).children("a").text(); }
        }
      )
      var listing = {
        'name': doctorName,
        'img': urlImage,
        'chucdanh': chucDanh,
        'chuyenkhoa': chuyenKhoa,
        'donvi': donVi,
        'mota': mota

      }

      parsedResults.push(listing)
    })

    // Pagination Elements Link
    const nextPageLink = 'https://vicare.vn/danh-sach/bac-si/ho-chi-minh/' +  $('.pagination').find('.step-links').children().last('a').attr('href')
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
