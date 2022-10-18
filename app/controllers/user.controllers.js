const bcrypt = require("bcryptjs");
const crypto = require("crypto-js");
const { log } = require("console");
const jwt = require("jsonwebtoken");
const { getlogin, register } = require("../queries/user.queries");
require("dotenv").config();

// Encryption function
/*********************/
function encrypt(data) {
  const encrypted = crypto.AES.encrypt(
    data,
    crypto.enc.Base64.parse(process.env.CRYPTOJS_KEY),
    {
      iv: crypto.enc.Base64.parse(process.env.CRYPTOJS_IV),
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7,
    }
  );
  return encrypted.toString();
}

// Sign Up
/**********/
exports.signup = async (req, res, next) => {
  try {
    // email and password encryption
    let cryptmail = encrypt(req.body.email);
    let hashpwd = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );
    // User created and returned with hateoas
    const signup = await register(cryptmail, hashpwd);
    res.status(201).json({ message: "User created !" }, hateoasLinks(req));
  } catch (e) {
    res.status(401).json({ message: "Email already exists !" });
    next(e);
  }
};

// Login
/********/
exports.login = async (req, res, next) => {
  try {
    // search for the user's encrypted email in the database
    let cryptmail = encrypt(req.body.email);
    const user = await getlogin(cryptmail);
    if (user === null) {
      throw "Incorrect User";
    }
    // compares the encrypted database password with the encrypted login password
    let compare = await bcrypt.compare(req.body.password, user.password);
    if (compare) {
      // creation of the token
      let token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
        expiresIn: "24h",
      });
      // return user id and token with hateoas
      res.status(201).json(
        {
          message: "User match !",
          userId: user._id,
          token: token,
        },
        hateoasLinks(req)
      );
    } else {
      throw "Incorrect Password";
    }
  } catch (e) {
    res.status(401).json({ message: e });
    next(e);
  }
};

// Hateos Links
/**************/
function hateoasLinks(req) {
  const baseUrl = req.protocol + "://" + req.get("host");

  return [
    {
      rel: "create",
      method: "POST",
      title: "Create User",
      href: baseUrl + "/api/auth/signup",
    },
    {
      rel: "login",
      method: "POST",
      title: "Login User",
      href: baseUrl + "/api/auth/login",
    },
  ];
}
