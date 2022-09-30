// import
const router = require('express').Router();
const usersRoutes = require("./user");
const saucesRoutes = require('./sauce');


router.use('/auth', usersRoutes);
router.use('/sauces', saucesRoutes);


module.exports = router;