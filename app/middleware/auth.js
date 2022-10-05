let jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        req.auth = {
            userId : decodedToken.userId
        }
        next();
    }catch(e){
        res.status(401).json({message: "Invalidate authentification token "})
    }
}