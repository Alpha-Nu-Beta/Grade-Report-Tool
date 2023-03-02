const uploadInput = document.getElementById("uploadInput");
uploadInput.addEventListener(
  "change",
  () => {
    const fileData = getRawFileData(uploadInput.files[0]);
  },
  false
);

const getRawFileData = async (file) => {
  const reader = new FileReader();
  await reader.readAsText(file);
  reader.onload = () => {
    return ripData(reader.result);
  };
};

const ripData = (fileData) => {
  var data = fileData.split("\n");
  data = data.slice(1, data.length);
  data = data.map((row) => {
    return row.split(",");
  });
  printData(data);
};

const printData = (data) => {
  console.log(
    "Name, Student ID, Term GPA, Term Hours, Grade Points, CUM GPA, CUM Hours"
  );
  dataTotal = [];
  data.forEach((row) => {
    console.log(row.join(", "));
    addToTable(row);
    dataTotal.push(row);
  });
  calcStats(dataTotal);
};

const addToTable = (row) => {
  const table = document.querySelector("table");
  const rowElement = document.createElement("tr");
  row.forEach((cell) => {
    const cellElement = document.createElement("td");
    cellElement.innerHTML = cell;
    rowElement.appendChild(cellElement);
  });
  table.appendChild(rowElement);
};

const calcStats = (data) => {
  const section = document.querySelector("div#stats");
  const gpaTotal = data.reduce((total, row) => {
    return total + parseFloat(row[4]);
  }, 0);
  const hoursTotal = data.reduce((total, row) => {
    return total + parseFloat(row[3]);
  }, 0);
  const childElem = document.createElement("p");
  childElem.innerHTML = `GPA: ${gpaTotal / hoursTotal} Hours: ${hoursTotal}`;
  section.appendChild(childElem);
};
