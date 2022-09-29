const bcrypt = require('bcryptjs'); 
const crypto = require('crypto-js');
const { log } = require('console');
const jwt = require('jsonwebtoken');
const { getlogin, register } = require('../queries/user-queries');
require('dotenv').config();

exports.signup = async (req, res, next) => {
    try{

        let cryptmail = crypto.AES.encrypt(req.body.email, crypto.enc.Base64.parse(process.env.CRYPTOJS_EMAIL), {iv: crypto.enc.Base64.parse(process.env.CRYPTOJS_EMAIL)}).toString(); 
        let hashpwd = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        
        const signup = await register(cryptmail, hashpwd);
        res.status(201).json({ message: 'User created !' })

    }catch(e){
        res.status(401).json({message: 'Email already exists !'});
        next(e);
    }
};

exports.login = async (req, res, next) => {
    try{
        let cryptmail = crypto.AES.encrypt(req.body.email, crypto.enc.Base64.parse(process.env.CRYPTOJS_EMAIL), {iv: crypto.enc.Base64.parse(process.env.CRYPTOJS_EMAIL)}).toString();
        const user = await getlogin(cryptmail);
        let compare = await bcrypt.compare(req.body.password, user.password);
        if(compare){
            let token = jwt.sign({userId : user._id}, process.env.TOKEN, {expiresIn: '24h'});
            
            res.status(201).json({ 
                message: 'User match !', 
                userId: user._id,
                token: token,
            });
        }else{
            res.status(401).json({message: 'Incorrect Password !'});
        }

    }catch(e){
        res.status(401).json({message: 'Incorrect User'});
        next(e);
    }
};



