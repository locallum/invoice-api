const HTTPError = require('http-errors');
const nodemailer = require('nodemailer');
const validator = require('validator');

async function sendInvoice(email, pdfData) {
  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Email is not valid');
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user: 'sherlock.invoicing@gmail.com',
      pass: 'msyl hqlj elde hhax'
    }
  });
  const mail = {
    from: `Sherlock Invoicing <sherlock.invoicing@gmail.com>`,
    to: email,
    subject: 'Sherlock Invoice',
    attachments: [
      {
        filename: 'invoice.pdf',
        content: pdfData,
        encoding: 'base64'
      }
    ]
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    throw HTTPError(400, 'Error sending email');
  }
  return {
    invoiceSent: true
  };
}

module.exports = { sendInvoice }