const fs = require('fs');
const chalk = require('chalk')
const outputFile = 'doctor.sql';
let basilist;
let sqlString = "";

let chuyenkhoa = ["Đa khoa", "Da liễu", "Dị ứng", "Hô hấp", "Nhãn khoa", "Sản phụ", "Tai mũi họng", "Tiêu hoá", "Tim mạch", "cổ truyền"];

let chuyenkhoacnt = [0,0,0,0,0,0,0,0,0,0];


fs.readFile('data-bacsi.json', 'utf8', function(err, data){
    basilist = JSON.parse(data);
    let count = 0;
    basilist.forEach((element, index) => {
      let department_id = 1;
      console.log(count++);
      chuyenkhoa.forEach((e, idx) => {
        // if(element.chuyenkhoa != undefined)
        //  {console.log(element.chuyenkhoa.toString().toLowerCase().indexOf(e.toLowerCase()));}
        if (element.chuyenkhoa != undefined && element.chuyenkhoa.toString().toLowerCase().indexOf(e.toLowerCase()) >= 0) {
            department_id = idx + 1;
        }

        if (element.chuyenkhoa != undefined && element.chuyenkhoa.toString().toLowerCase().indexOf("xương") >= 0)  {
          department_id = 10;
          chuyenkhoacnt[9] ++;
        }

        if (element.chuyenkhoa != undefined && element.chuyenkhoa.toString().toLowerCase().indexOf("tai") >= 0)  {
          department_id = 7;
          chuyenkhoacnt[6] ++;
        }

        if (element.chuyenkhoa != undefined && element.chuyenkhoa.toString().toLowerCase().indexOf("mũi") >= 0)  {
          department_id = 7;
          chuyenkhoacnt[6] ++;
        }

        if (element.chuyenkhoa != undefined && element.chuyenkhoa.toString().toLowerCase().indexOf("họng") >= 0)  {
          department_id = 7;
          chuyenkhoacnt[6] ++;
        }

        if (element.chuyenkhoa != undefined && element.chuyenkhoa.toString().toLowerCase().indexOf("dạ dày") >= 0)  {
          department_id = 8;
          chuyenkhoacnt[7] ++;
        }

        
      }
      
      );
      chuyenkhoacnt[department_id -1] ++;
        element.name.toString().replace(/[^a-zA-Z ]/g, '').replace(/[\']/g, '');
        if(element.mota != undefined) element.mota.toString().replace(/[^a-zA-Z ]/g, "").replace(/[\']/g, '');
        element.diachi.toString().replace(/[^a-zA-Z ]/g, "").replace(/[\']/g, '').replace(/[\']/g, '').replace(/[\']/g, '');
        sqlString += "INSERT INTO `USER` (`EMAIL`, `PASSWORD`, `STATUS`) VALUES ('', '', 'NORMAL');\n";
        sqlString += "INSERT INTO `PROFILE` (PROFILE_TYPE, `NAME`, AVATAR_IMG, DESCRIPTION, ADDRESS, RATE_SUMMARY, USER_ID, DEPARTMENT_ID)"
                    + " VALUES ('DOC', '" + element.name + "', '" + element.img + "', '" + element.mota + "', '" + element.diachi.toString() + "', "
                    + "5.0, LAST_INSERT_ID(), " + department_id + "); \n";
    });
    
    exportResults(sqlString);
  });



const exportResults = (parsedResults) => {
    fs.writeFile(outputFile, parsedResults, (err) => {
      if (err) {
        console.log(err)
      }
      console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
      chuyenkhoacnt.forEach((el, idx) => {
        console.log(chuyenkhoa[idx] + ": " + el);
      })
    })
  }


