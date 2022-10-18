let jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    // recovery of the token in the header of the request
    const token = req.headers.authorization.split(" ")[1];
    // token decoding...
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    // returns the decoded token in the request
    req.auth = {
      userId: decodedToken.userId,
    };
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalidate authentification token " });
  }
};
