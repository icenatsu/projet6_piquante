
const router = require('express').Router();
const usersRoutes = require("./user");

router.use('/auth', usersRoutes);

module.exports = router;