const parser = require('./parser');
const generate = require('./generate');

async function main(xmlData, template) {
  try {
    var obj = await parser.parser(xmlData);
    generate.toFile(obj, template);
  } catch (error) {
    console.error(error);
  }
}

module.exports = main;
