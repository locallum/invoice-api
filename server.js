const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const morgan = require('morgan')
const config = require('./config.json');
const main = require('./main');
const auth = require('./auth');
const helper = require('./helper');
const { sendInvoice } = require('./send');

const app = express();
const HOST = process.env.IP || 'localhost';
const PORT = parseInt(process.env.PORT || config.port);

// Set up multer for file upload handling
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'frontend')));

// create a write stream
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))


// ================================================================ //
// Auth functions
app.post('/auth/register', async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        return res.json(auth.register(name, email, password, password2));
    } catch (err) {
        next(err);
    }
});

app.post('/auth/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        return res.json(auth.login(email, password));
    } catch (err) {
        next(err);
    }
});

app.post('/auth/logout', (req, res, next) => {
    try {
        const token = req.body.token;
        return res.json(auth.logout(token));
    } catch (err) {
        next(err);
    }
});

// ================================================================ //
// Page functions
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/login.html');
});

app.get('/auth', (req, res) => {
    res.sendFile(__dirname + '/frontend/register.html');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/frontend/home.html');
});

app.get('/create', (req, res) => {
    res.sendFile(__dirname + '/frontend/create.html');
});

app.get('/display', (req, res) => {
    res.sendFile(__dirname + '/frontend/display.html');
});

app.get('/send', (req, res) => {
    res.sendFile(__dirname + '/frontend/send.html');
});

app.get('/validate', (req, res) => {
    res.sendFile(__dirname + '/frontend/validate.html');
});

// ================================================================ //
// Invoice functions
app.post('/generate-pdf', upload.none(), async (req, res) => {
    try {
        const { xmlData, template } = req.body;
        
        // Check if xmlData exists
        if (!xmlData) {
            return res.status(400).send('Bad Request: XML data is required');
        }
        
        // Call main function to generate PDF
        await main(xmlData, template);
        
        // Send generated PDF as response
        res.download(__dirname + '/invoice.pdf');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error: Unable to generate PDF');
    }
});

app.post('/generate/fromXML', upload.single('xmlFile'), async (req, res) => {
    try {
        const { template } = req.body;
        const xmlFilePath = req.file.path;
        
        // Call main function to generate PDF
        fs.readFile(xmlFilePath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            await main(data, template);
          });
        res.download(__dirname + '/invoice.pdf');
    } catch (err) {
        res.status(400).send('Bad Request: Unable to Generate PDF');
    }
});

app.post('/invoice/send', async (req, res) => {
    try {
        const { email, pdfData } = req.body;
        await sendInvoice(email, pdfData);
        res.status(200).send("Successfully sent Invoice");
    } catch (err) {
        res.status(400).send('Bad Request: Unable to Send PDF Invoice');
    }
});

// ================================================================ //
// Other functions
app.delete('/clear', (req, res, next) => {
    try {
      return res.json(helper.clear());
    } catch (err) {
      next(err);
    }
});

if (process.env.NODE_ENV != 'test') {
    app.listen(PORT, () => {
        console.log(`⚡️ Server is running on http://${HOST}:${PORT}`);
    });
}

module.exports = app;