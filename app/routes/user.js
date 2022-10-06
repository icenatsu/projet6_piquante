// import
const router = require('express').Router();
const userCtrl = require('../controllers/user.controllers');
const pwdCtrl = require('../middleware/password')
const mailCtrl = require('../middleware/controlEmail')


router.post('/signup', mailCtrl, pwdCtrl, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;