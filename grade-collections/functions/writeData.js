const Excel = require("exceljs");
const fs = require("fs");
const listDir = require("./listDir");
const readlineSync = require("readline-sync");
const uploadToDrive = require("./uploadToDrive");

async function writeData(data, term) {
  var pcFiles = await listDir("./jsondb");
  var pcArr = [];
  for (var i = 0; i < pcFiles.length; i++) {
    if (pcFiles[i].indexOf(".json") == -1) continue;
    var tmpFile = fs.readFileSync("./jsondb/" + pcFiles[i]);
    pcArr.push(JSON.parse(tmpFile));
  }

  // Create a new workbook
  const workbook = new Excel.Workbook();

  // Add a new sheet to the workbook
  var workbookArr = [workbook.addWorksheet("Master")];
  for (var i = 0; i < pcFiles.length; i++) {
    workbookArr.push(
      workbook.addWorksheet(
        "PC" + pcFiles[i].substring(2, pcFiles[i].indexOf(".json"))
      )
    );
  }

  // Add headers to each sheet
  workbookArr.forEach((sheet) => {
    sheet.addRow([
      "Name",
      "Student ID",
      "Term GPA",
      "Term Hours",
      "Grade Points",
      "CUM GPA",
      "CUM Hours",
    ]);
  });

  var counterMaster = 0;
  var counterAltMaster = 0;
  for (var i = 0; i < data.length; i++) {
    workbookArr[0].addRow([
      data[i].name,
      data[i].studentID,
      data[i].gpa,
      data[i].hours,
      data[i].gpa * data[i].hours,
      data[i].cumGPA,
      data[i].cumHours,
    ]);
    counterMaster += data[i].gpa;
    counterAltMaster++;
  }
  workbookArr[0].addRow([
    "",
    "",
    "",
    "",
    "",
    "Class GPA",
    (counterMaster / counterAltMaster).toFixed(2),
  ]);

  for (var x = 0; x < pcArr.length; x++) {
    var counter = 0;
    var counterAlt = 0;
    for (var j = 0; j < pcArr[x].length; j++) {
      for (var i = 0; i < data.length; i++) {
        if (pcArr[x][j].studentID === data[i].studentID) {
          workbookArr[x + 1].addRow([
            data[i].name,
            data[i].studentID,
            data[i].gpa,
            data[i].hours,
            data[i].gpa * data[i].hours,
            data[i].cumGPA,
            data[i].cumHours,
          ]);
          counter += data[i].gpa;
          counterAlt++;
        }
      }
    }
    workbookArr[x + 1].addRow([
      "",
      "",
      "",
      "",
      "",
      "Class GPA",
      (counter / counterAlt).toFixed(2),
    ]);
  }

  // Save the workbook to an .xlsx file
  workbook.xlsx.writeFile("./reports/" + term + ".xlsx").then(function () {
    console.log("The workbook was saved!");
    console.log("Find it at ./reports/" + term + ".xlsx");
    var uploadBool = readlineSync.question("Upload to Google Drive? (y/n) ");
    uploadBool == "y"
      ? uploadToDrive()
      : console.log("Not uploading to Google Drive.");
  });
}

module.exports = writeData;
