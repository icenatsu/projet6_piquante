// Controle de la qualité du mot de passe à l'inscription
const passwordValidator = require('password-validator');
const passwordShema = new passwordValidator();

passwordShema
.is().min(8)                                    // Minimum length 8
.is().max(20)                                  // Maximum length 20
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123', 'Azerty1', 'Azerty2']); // Blacklist these values


module.exports = (req, res, next) => {
    if(passwordShema.validate(req.body.password)){
        next();
    }else{
        return res.status(400).json({
            error: `Password is not strong.`})
    }
}