const bcrypt = require('bcryptjs'); 
const crypto = require('crypto-js');
const { log } = require('console');
const jwt = require('jsonwebtoken');
const { getlogin, register } = require('../queries/user.queries');
require('dotenv').config();

function encrypt(data){
    const encrypted = crypto.AES.encrypt(
    data, 
    crypto.enc.Base64.parse(process.env.CRYPTOJS_KEY),
    {
        iv: crypto.enc.Base64.parse(process.env.CRYPTOJS_IV), 
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7 
    });
    return encrypted.toString();
}

exports.signup = async (req, res, next) => {
    try{

        let cryptmail = encrypt(req.body.email);
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
        let cryptmail = encrypt(req.body.email);
        const user = await getlogin(cryptmail);
        let compare = await bcrypt.compare(req.body.password, user.password);
        if(compare){
            let token = jwt.sign({userId : user._id}, process.env.JWT_TOKEN, {expiresIn: '24h'});
            
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



