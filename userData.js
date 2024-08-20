const fs = require('fs');

const fileName = 'data.json';

var data = [];

function getData() {
  loadData();
  return data;
}

function setData(newData) {
  data = newData;
  saveData();
}

function saveData() {
  fs.writeFileSync(fileName, JSON.stringify(data));
}

function loadData() {
  if (fs.existsSync(fileName)) {
    data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  }
}

module.exports = { getData, setData };