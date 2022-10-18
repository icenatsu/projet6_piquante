const bunyan = require("bunyan");
const path = require("path");

// HTTP Logger request
/************************/
function reqSerializer(req) {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  };
}

const httpLogger = bunyan.createLogger({
  name: "HTTP LOGGER",
  streams: [
    {
      level: "info",
      stream: process.stdout,
    },
    {
      level: "debug",
      stream: process.stdout,
    },
    {
      level: "error",
      stream: process.stderr,
    },
    {
      type: "rotating-file",
      path: path.join(__dirname, "../log/httpaccessinfo.log"),
      period: "1d", // daily rotation
      count: 3, // keep 3 copies
      level: "info",
    },
  ],

  serializers: {
    httpQuery: reqSerializer,
  },
});

// Database Logger request
/************************/
const databaseLogger = bunyan.createLogger({
  name: "DATABASE LOGGER",
  streams: [
    {
      level: "info",
      stream: process.stdout,
    },
    {
      level: "debug",
      stream: process.stdout,
    },
    {
      level: "error",
      stream: process.stderr,
    },
    {
      type: "rotating-file",
      path: path.join(__dirname, "../log/dataaccessinfo.log"),
      period: "1d",
      count: 3,
      level: "info",
    },
  ],
});

module.exports = { httpLogger, databaseLogger };
