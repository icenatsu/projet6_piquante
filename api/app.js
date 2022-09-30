const express = require('express');
const routing = require('./routes/routedispatch');
require('./database/connect');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname,'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
app.use('/api', routing);

module.exports = app;