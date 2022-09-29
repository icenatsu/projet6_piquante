let jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        decodeToken = jwt.verify(token, process.env.TOKEN);
        req.auth = {
            userId : decodeToken
        }
        next();
    }catch(e){
        res.status(401).json({message: "Invalidate authentification token "})
    }
}