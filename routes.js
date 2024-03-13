let express = require("express");
let router = express.Router();
let authController = require("./controller/auth");
let {auth} = require("./middleware/auth")

router.get("/",(req,res)=>{
    return res.send("Welcome to the The organil")
})

// Authetication Routes
router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/fogetPassword',authController.fogetPassword);
router.put('/resetPassword',authController.resetPassword);
router.put('/changePassword',auth,authController.changePassword);
router.put('/logOut',auth,authController.logOut);


module.exports = router;