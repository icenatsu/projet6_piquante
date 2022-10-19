const express = require("express");
const routing = require("./app/routes/index");
require("./app/database/connect");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
require("dotenv").config();
const hateoasLinker = require("express-hateoas-links");
// const buynan = require("./app/log/logger");
const { log } = require("console");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hateoasLinker);
app.use("/images", express.static(path.join(__dirname, "app/images")));

// Speed slowdown if too many requests from the same ip
/********************************************************/
app.use(
  slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 100,
    delayMs: 500,
  })
);

// Rate limitation if too many requests from the same ip
/********************************************************/
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

// Mongo sanitize
/****************/
// Prevent MongoDB operator injection.
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
  })
);

// HEADERS
/*********/
// helps you protect your application from some of the web's well-
// known vulnerabilities by configuring HTTP headers appropriately.
app.use(helmet());

app.use((req, res, next) => {
  // set response headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api", routing);

module.exports = app;
