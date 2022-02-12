const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
 
const app = express();
 
app.use(cors());

app.use('/public', express.static('public'))

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.socket.io/", "'unsafe-inline'"],
                connectSrc: ["'self'", "localhost:3000/example"],
                styleSrc: ["'self'", "fonts.googleapis.com", "'unsafe-inline'"],
                fontSrc: ["'self'", "fonts.gstatic.com"],
                imgSrc: ["'self'", "https://maps.gstatic.com", "https://maps.googleapis.com", "data:", "https://another-domain.com"],
                frameSrc: ["'self'", "https://www.google.com"]
            }
        },
    })
);
 
app.use(express.json());

//Rotas
const index = require('./routes/index');
const exampleRoute = require('./routes/exampleRoute');

app.use('/', index);
app.use('/example', exampleRoute);

module.exports = app;