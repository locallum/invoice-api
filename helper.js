const crypto = require('crypto'); 
const fs = require('fs');
const database = require('./userData');

const SECRET = 'Teatime';
const ELEMENT = 'Water';

function getHashOf(plaintext) {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}

function checkValidToken(token) {
  const users = database.getData();
  for (const user of users) {
    for (const existToken of user.tokens) {
      if (getHashOf(existToken + ELEMENT) == token) {
        return true;
      }
    }
  }
  return false;
}

function removeFile() {
  if (fs.existsSync('data.json')) {
    fs.unlinkSync('data.json');
  }
}

function clear() {
  database.setData([]);
  return {};
}

module.exports = { SECRET , ELEMENT, getHashOf, checkValidToken, removeFile, clear };