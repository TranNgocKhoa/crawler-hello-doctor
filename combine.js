var fs = require('fs');
const chalk = require('chalk')
const outputFile = 'data-bacsi.json'
var data_bacsi;
var data_diachi
fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) throw err;
  data_bacsi = JSON.parse(data);


  fs.readFile('data-diachi.json', 'utf8', function(err, data){
    data_diachi = JSON.parse(data);

    data_bacsi.forEach((element, index) => {
        element.diachi = data_diachi[index].diaChi;
    });
    exportResults(data_bacsi);
  })
});


const exportResults = (parsedResults) => {
    fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
      if (err) {
        console.log(err)
      }
      console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
    })
  }
