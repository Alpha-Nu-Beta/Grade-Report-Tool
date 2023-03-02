const fs = require("fs");
const pdf = require("pdf-parse");
const readlineSync = require("readline-sync");

const {
  getTerm,
  getStudentName,
  getStudentID,
  listDir,
  getCUMGPA,
  writeData,
  getCUMHours,
} = require("./functions");

const NORMAL_MODE = 0;
const TEST_MODE = 1;
const SINGLE_MODE = 2;

async function main(mode) {
  var termSelect = readlineSync.question(
    "Enter term as it's shown on transcript (i.e. 2022Fall, 2023Spring, etc.):\n"
  );
  while (/20[0-9][0-9](Fall|Spring)/.test(termSelect) == false) {
    console.error("Please enter a valid term!");
    termSelect = readlineSync.question(
      "Enter term as it's shown on transcript (i.e. 2022Fall, 2023Spring, etc.):\n"
    );
  }

  switch (mode) {
    case NORMAL_MODE:
      var people = [];
      const files = await listDir("./files");
      for (var i = 0; i < files.length; i++) {
        if (files[i].indexOf(".pdf") == -1) continue;
        let dataBuffer = await fs.promises.readFile("./files/" + files[i]);

        await pdf(dataBuffer).then(async function (data) {
          try {
            var person = await findGPA(data.text, termSelect);
            people.push(person);
          } catch (err) {
            console.error("Error occurred while reading file!", err);
          }
        });
      }
      writeData(people, termSelect);
      break;
    case TEST_MODE:
      break;
  }
}

async function findGPA(data, termSelect) {
  try {
    var term = await getTerm(data, termSelect);
  } catch (err) {
    console.error("Error occurred while reading file!", err);
  }

  var gpa = term.substring(
    term.indexOf("Term GPA") + 8,
    term.indexOf("Term Totals")
  );
  gpa = parseFloat(gpa);

  var hours = term.substring(
    term.indexOf("Term Totals") + 11,
    term.indexOf("Term Totals") + 17
  );
  if (hours.substring(1, 2) == ".") {
    hours = hours.substring(0, 5);
  }
  hours = parseFloat(hours);

  try {
    var studentID = await getStudentID(data);
  } catch (err) {
    console.error("Error occurred while reading file!", err);
  }

  try {
    var name = await getStudentName(data);
  } catch (err) {
    console.error("Error occurred while reading file!", err);
  }

  var cumGPA = getCUMGPA(data);
  var cumHours = getCUMHours(data);

  var person = { name, studentID, gpa, hours, cumGPA, cumHours };

  return person;
}

function modeSelect() {
  var modeInput = readlineSync.question(
    "Do you want to run in normal mode or test mode?\nType 0 for normal mode or 1 for test mode:\n"
  );
  while (/0|1/.test(modeInput) == false) {
    console.log("Invalid input. Please try again.");
    modeInput = readlineSync.question(
      "Do you want to run in normal mode or test mode?\nType 0 for normal mode or 1 for test mode:\n"
    );
  }
  if (modeInput == TEST_MODE) {
    console.log("Running in test mode.");
    main(TEST_MODE);
  } else if (modeInput == NORMAL_MODE) {
    console.log("Running in normal mode.");
    main(NORMAL_MODE);
  }
}

modeSelect();
