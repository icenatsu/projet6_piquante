const bunyan = require("bunyan");
const path = require("path");

// Database Logger request
/************************/
function dbSerializer(data) {
  let query = JSON.stringify(data.query);
  let doc = JSON.stringify(data.doc || {});
  let options = JSON.stringify(data.options || {});

  return `db.${data.collection}.${data.method}(${query},${doc},${options})`;
}

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
      path: path.join(__dirname, "../logs/dataaccessinfo.log"),
      period: "1d",
      count: 3,
    },
  ],
  serializers: {
    dbQuery: dbSerializer,
  },
});

module.exports = databaseLogger;
