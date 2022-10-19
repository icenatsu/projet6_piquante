// import
const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const sauceCtrl = require("../controllers/sauce.controllers");

// Road Sauce
/************/
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.readAllSauces);
router.get("/:id", auth, sauceCtrl.readOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
