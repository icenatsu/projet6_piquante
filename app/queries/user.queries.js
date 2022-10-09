const User = require("../database/models/user.model");

exports.register = (cryptmail, hashpwd) => {
    const user = new User({
        email: cryptmail,
        password: hashpwd
    })
    return user.save();
}

exports.getlogin = (cryptmail) => { 
    return User.findOne({email: cryptmail}).exec();
}