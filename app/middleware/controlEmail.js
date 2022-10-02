const validator = require("validator");

module.exports = (req,res,next) => {
    const email = req.body.email; 
    
    if(validator.isEmail(email)){
        console.log('mail valide');
        next();
    }else{
        return res.status(400).json({error : `${email} is not valid mail`});
    }
}