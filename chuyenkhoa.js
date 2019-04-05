// External dependencies
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')
let chuyenKhoa = 'Sản phụ khoa';
let parsedResults = []
const url = 'https://vicare.vn/danh-sach/bac-si/ca-nuoc/chuyenkhoa-tieu-hoa-gan-mat/'
const outputFile = 'data-chuyenkhoa-tieuhoaganmat.json'
let datachuyenkhoa = {}
datachuyenkhoa.chuyenkhoa = chuyenKhoa;
datachuyenkhoa.trieuchung = [];

const pageLimit = 130

let pageCounter = 0
let resultCount = 0


console.log(chalk.yellow.bgBlue(`\n  Scraping of ${chalk.underline.bold(url)} initiated...\n`))

const getWebsiteContent = async (url) => {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)

        // New Lists
        $('.info').children('h2').map((i, element) => {
            pageCounter++
            var bsUrl = 'https://vicare.vn' + $(element).children().first('a').attr('href');
            console.log(parsedResults);
            getsymptom(bsUrl);
            
        })

        
        
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
        console.log(chalk.yellow.bgBlue(`\n Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
    })
}

const getsymptom = async (bsUrl) => {
    
    console.log("hghfghfh + " + pageCounter)
    console.log(chalk.yellow.bgBlue(`\n  Scraping of ${chalk.underline.bold(bsUrl)} initiated...\n`))
    const bsresponse = await axios.get(bsUrl)
    const j$ = cheerio.load(bsresponse.data)
    j$('.fa.fa-fw.fa-list').parent().parent().parent()
        .children('.collapsible-target.text-bold')
        .children().children().map((idx, element) => {
            parsedResults.push(j$(element).first('p').text().replace(/[\n\t]/g, ''));
            pageCounter ++; 
            console.log(pageCounter)
            if (pageCounter === pageLimit) {
                datachuyenkhoa.trieuchung.push(parsedResults);
                exportResults(parsedResults);
                return false
            }
        }); 
    
}

getWebsiteContent(url)
