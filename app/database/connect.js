const mongoose = require("mongoose");
require("dotenv").config();
const { debug, log } = require("console");
const bunyan = require("../log/logger");

// Logging database queries
mongoose.set("debug", (collection, method, query, doc, options) => {
  const dbquery = {
    dbQuery: {
      collection,
      method,
      query,
      doc,
      options,
    },
  };
  bunyan.databaseLogger.info(dbquery);
});

const options = {
  useNewUrlParser: true, // Analyze mongoDB string
  useUnifiedTopology: true,
  ssl: true, // ensuring the security of communications
};

mongoose
  .connect(process.env.DB_URL, options)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
