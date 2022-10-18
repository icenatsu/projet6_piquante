const validator = require("validator");

// Email Compliance Check
/*************************/
module.exports = (req, res, next) => {
  const email = req.body.email;

  if (validator.isEmail(email)) {
    next();
  } else {
    return res.status(400).json({ error: `${email} is not valid mail` });
  }
};
