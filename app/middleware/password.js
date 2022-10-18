// Controle de la qualité du mot de passe à l'inscription
const passwordValidator = require("password-validator");
const passwordShema = new passwordValidator();

// Checking password quality
/***************************/
passwordShema
  // Minimum length 8
  .is()
  .min(8)
  // Maximum length 20
  .is()
  .max(20)
  // Must have uppercase letters
  .has()
  .uppercase()
  // Must have lowercase letters
  .has()
  .lowercase()
  // Must have at least 2 digits
  .has()
  .digits(2)
  // Should not have spaces
  .has()
  .not()
  .spaces()
  // Blacklist these values
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "Azerty1", "Azerty2"]);

module.exports = (req, res, next) => {
  if (passwordShema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error: `Password is not strong.`,
    });
  }
};
