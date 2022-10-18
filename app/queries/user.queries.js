const User = require("../database/models/user.model");

// creation of the user in the database
/**************************************/
exports.register = (cryptmail, hashpwd) => {
  const user = new User({
    email: cryptmail,
    password: hashpwd,
  });
  return user.save();
};

// search for the user in the database
/**************************************/
exports.getlogin = (cryptmail) => {
  return User.findOne({ email: cryptmail }).exec();
};
