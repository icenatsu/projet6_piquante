const router = require("express").Router();
const usersRoutes = require("./user");
const saucesRoutes = require("./sauce");

// routes dispatcher
/*****************/
router.use("/auth", usersRoutes);
router.use("/sauces", saucesRoutes);

module.exports = router;
