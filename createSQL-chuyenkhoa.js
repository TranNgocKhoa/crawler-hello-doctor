const fs = require('fs');
const chalk = require('chalk')
const outputFile = 'chuyenkhoa-yhoccotruyen.sql';
const inputFile = 'data-chuyenkhoa-yhoccotruyen.json';
const department = "Y học cổ truyền";
let chuyenkhoalist;
let sqlString = "";
const selectDepartMent = "SELECT ID FROM DEPARTMENT WHERE `NAME`='" + department + "'";



sqlString += "INSERT INTO `DEPARTMENT` (`NAME`) VALUES ('" + department + "');\n";
fs.readFile(inputFile, 'utf8', function(err, data){
    basilist = JSON.parse(data);
    basilist.forEach((element, index) => {
        sqlString += "INSERT INTO `SYMPTOM` (`NAME`) VALUES ('" + element + "');\n";
        sqlString += "INSERT INTO `DEPARTMENT_RELATE_SYMPTOM` (`DEPARTMENT_ID`, `SYMPTOM_ID`) VALUES ((" + selectDepartMent + "), LAST_INSERT_ID());\n";
    });
    
    exportResults(sqlString);
  });



const exportResults = (parsedResults) => {
    fs.writeFile(outputFile, parsedResults, (err) => {
      if (err) {
        console.log(err)
      }
      console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
    })
  }


