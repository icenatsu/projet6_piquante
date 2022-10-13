const express = require('express');
const routing = require('./app/routes/index');
require('./app/database/connect');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const slowDown = require("express-slow-down");
require('dotenv').config();
const bunyanMongoDbLogger = require('bunyan-mongodb-logger');
const hateoasLinker = require('express-hateoas-links');
const os = require('os');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(hateoasLinker);
app.use('/images', express.static(path.join(__dirname,'app/images')));

//////////////// LOG ///////////////////
// database access connection log
const logger = bunyanMongoDbLogger({
  name: os.userInfo().username,
  streams: ['mongodb', 'file'],
  url: process.env.DB_URL,
  path: path.join(__dirname, 'app/log/dataaccess.log'),
  level: 'info'
});
logger.info('piquante_bdd-access')

// Log requests and responses and setup the logger app.use(morgan('combined', {stream: accessLogStream})); 
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'app/log/access.log'), {flags: 'a'}); 
app.use(morgan('dev', {stream: accessLogStream}));

/////////////// SlowDown / Rate limiter //////////////////////
// Speed slowdown if too many requests from the same ip
app.use(slowDown({
  windowMs  :  15 * 60 * 1000,   
  delayAfter : 100,    
  delayMs : 500   
})); 

// rate limitation if too many requests from the same ip
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

/////////////// Mongo sanitize //////////////////////
// Prevent MongoDB operator injection.
app.use(mongoSanitize({
    allowDots: true,
    replaceWith: '_'
}));

////////////////// HEADERS ////////////////////////////////////////
// helps you protect your application from some of the web's well-
// known vulnerabilities by configuring HTTP headers appropriately.
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
app.use('/api', routing);

module.exports = app;