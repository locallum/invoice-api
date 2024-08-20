const { beforeEach, describe, test, expect } = require('@jest/globals');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('./server.js');


beforeEach(() => {
  // removes invoice.pdf
  removeFile();
  // make sure that invoice.pdf does not exist
  expect(fs.existsSync('invoice.pdf')).toBe(false);
});

describe('System Tests', () => {
  // invalid file
  test('error: given an invalid xml file', async () => {
    await request(app)
      .post('/generate-pdf')
      .send({ file: 'test_files/example1.xml', template: 1 })

    // Assertion: Check if the PDF file is not created
    expect(fs.existsSync('invoice.pdf')).toBe(false);
  });

  describe('Template 1 Tests', () => {
    test('succesful main function with template 1 and 1 item', async () => {
      const filePath = path.resolve(__dirname, 'test_files/example1.xml');

      await request(app)
        .post('/generate-pdf')
        .attach('xmlFile', filePath) // Attach the file using its path
        .field('template', 1) // Send the template number
        .expect(200);

      // Assertion: Check if the PDF file is created
      expect(fs.existsSync('invoice.pdf')).toBe(true);
    }); 

    test('succesful main function with template 1 and 2 items', async () => {
      const filePath = path.resolve(__dirname, 'test_files/multiple.xml');

      await request(app)
        .post('/generate-pdf')
        .attach('xmlFile', filePath) // Attach the file using its path
        .field('template', 1) // Send the template number
        .expect(200);

      // Assertion: Check if the PDF file is created
      expect(fs.existsSync('invoice.pdf')).toBe(true);
    }); 
  });

  describe('Template 2 Tests', () => {
    test('succesful main function with template 2 and 1 item', async () => {
      const filePath = path.resolve(__dirname, 'test_files/example1.xml');

      await request(app)
        .post('/generate-pdf')
        .attach('xmlFile', filePath) // Attach the file using its path
        .field('template', 2) // Send the template number
        .expect(200);

      // Assertion: Check if the PDF file is created
      expect(fs.existsSync('invoice.pdf')).toBe(true);
    }); 

    test('succesful main function with template 2 and 2 items', async () => {
      const filePath = path.resolve(__dirname, 'test_files/multiple.xml');

      await request(app)
        .post('/generate-pdf')
        .attach('xmlFile', filePath) // Attach the file using its path
        .field('template', 2) // Send the template number
        .expect(200);

      // Assertion: Check if the PDF file is created
      expect(fs.existsSync('invoice.pdf')).toBe(true);
    }); 
  });
});

function removeFile() {
  if (fs.existsSync('invoice.pdf')) {
    fs.unlinkSync('invoice.pdf');
  }
}